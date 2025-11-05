import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, useWindowDimensions, TextInput, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { CheckInStatus } from '../../types';

const checkInOptions: Array<{
  status: CheckInStatus;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  borderColor: string;
}> = [
  {
    status: 'clean',
    label: 'Clean Day',
    desc: 'I stayed on track today',
    icon: 'checkmark-circle',
    color: '#10b981',
    bgColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  {
    status: 'struggled',
    label: 'Struggled',
    desc: 'I was tempted but resisted',
    icon: 'fitness',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  {
    status: 'slip',
    label: 'Minor Slip',
    desc: 'I slipped but caught myself',
    icon: 'warning',
    color: '#fb923c',
    bgColor: '#fff7ed',
    borderColor: '#fb923c',
  },
  {
    status: 'relapse',
    label: 'Relapse',
    desc: 'I need to reset and start again',
    icon: 'refresh-circle',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#ef4444',
  },
];

export default function CheckInScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [selected, setSelected] = useState<CheckInStatus | ''>('');
  const [trigger, setTrigger] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert('Please select an option', 'How did today go?');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to check in');
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Save check-in
      await addDoc(collection(db, 'dailyCheckIns'), {
        uid: currentUser.uid,
        date: today,
        status: selected,
        trigger: trigger || null,
        timestamp: new Date(),
      });

      // Update user stats
      const userRef = doc(db, 'users', currentUser.uid);

      if (selected === 'clean' || selected === 'struggled') {
        // Increment streak
        await updateDoc(userRef, {
          streakCount: increment(1),
          lastCheckInDate: today,
          totalCheckIns: increment(1),
        });
      } else {
        // Reset streak on slip/relapse
        await updateDoc(userRef, {
          streakCount: 0,
          lastCheckInDate: today,
          totalCheckIns: increment(1),
        });
      }

      // Show success modal
      setShowSuccessModal(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelected('');
        setTrigger('');
        router.push('/(tabs)/home');
      }, 2000);
    } catch (error) {
      console.error('Error submitting check-in:', error);
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSelected('');
    setTrigger('');
    router.push('/(tabs)/home');
  };

  const selectedOption = checkInOptions.find(opt => opt.status === selected);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              Daily Check-In
            </Text>
            <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
              How did today go for you?
            </Text>
          </View>

          {/* Check-in Options */}
          <View style={styles.optionsContainer}>
            {checkInOptions.map((option) => {
              const isSelected = selected === option.status;
              return (
                <TouchableOpacity
                  key={option.status}
                  style={[
                    styles.optionCard,
                    isDesktop && styles.optionCardDesktop,
                    isSelected && {
                      backgroundColor: option.bgColor,
                      borderColor: option.borderColor,
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => setSelected(option.status)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionIconContainer,
                      { backgroundColor: isSelected ? option.color : '#f3f4f6' }
                    ]}>
                      <Ionicons
                        name={option.icon}
                        size={isDesktop ? 36 : 28}
                        color={isSelected ? '#ffffff' : '#9ca3af'}
                      />
                    </View>
                    <View style={styles.optionText}>
                      <Text style={[
                        styles.optionLabel,
                        isDesktop && styles.optionLabelDesktop,
                        isSelected && { color: option.color }
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={[
                        styles.optionDesc,
                        isDesktop && styles.optionDescDesktop
                      ]}>
                        {option.desc}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Trigger Input */}
          {(selected === 'struggled' || selected === 'slip' || selected === 'relapse') && (
            <View style={styles.triggerSection}>
              <Text style={[styles.inputLabel, isDesktop && styles.inputLabelDesktop]}>
                What triggered this? (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDesktop && styles.textInputDesktop
                ]}
                placeholder="e.g., Boredom, stress, late night..."
                placeholderTextColor="#9ca3af"
                value={trigger}
                onChangeText={setTrigger}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={styles.infoCard}>
                <Ionicons name="bulb-outline" size={20} color="#2563eb" />
                <Text style={[styles.infoText, isDesktop && styles.infoTextDesktop]}>
                  <Text style={styles.infoTextBold}>Identifying triggers</Text> helps you and your coach develop strategies to avoid them in the future.
                </Text>
              </View>
            </View>
          )}

          {/* Success Message */}
          {selected === 'clean' && (
            <View style={styles.successCard}>
              <View style={styles.messageHeader}>
                <Ionicons name="trophy" size={28} color="#16a34a" />
                <Text style={[styles.messageTitle, isDesktop && styles.messageTitleDesktop, { color: '#16a34a' }]}>
                  Amazing!
                </Text>
              </View>
              <Text style={[styles.messageText, isDesktop && styles.messageTextDesktop]}>
                Another day of victory! Keep building that streak.
              </Text>
            </View>
          )}

          {/* Encouragement Message */}
          {selected === 'relapse' && (
            <View style={styles.encouragementCard}>
              <View style={styles.messageHeader}>
                <Ionicons name="heart" size={28} color="#ea580c" />
                <Text style={[styles.messageTitle, isDesktop && styles.messageTitleDesktop, { color: '#ea580c' }]}>
                  You're not alone
                </Text>
              </View>
              <Text style={[styles.messageText, isDesktop && styles.messageTextDesktop]}>
                Recovery isn't linear. What matters is that you're here, being honest, and ready to try again. Your coach will help you learn from this.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, isDesktop && styles.footerDesktop]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isDesktop && styles.submitButtonDesktop,
            !selected && styles.submitButtonDisabled,
            selectedOption && { backgroundColor: selectedOption.color }
          ]}
          onPress={handleSubmit}
          disabled={!selected || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
              <Text style={[styles.submitButtonText, isDesktop && styles.submitButtonTextDesktop]}>
                Submit Check-In
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>
            <Text style={[styles.modalTitle, isDesktop && styles.modalTitleDesktop]}>
              Check-In Submitted!
            </Text>
            <Text style={[styles.modalSubtitle, isDesktop && styles.modalSubtitleDesktop]}>
              Your check-in has been recorded. Keep up the great work!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessModalClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  contentDesktop: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  titleDesktop: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  subtitleDesktop: {
    fontSize: 18,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardDesktop: {
    padding: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionLabelDesktop: {
    fontSize: 19,
  },
  optionDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionDescDesktop: {
    fontSize: 15,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputLabelDesktop: {
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    marginBottom: 16,
  },
  textInputDesktop: {
    fontSize: 16,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
  infoTextDesktop: {
    fontSize: 15,
  },
  infoTextBold: {
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  encouragementCard: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  messageTitleDesktop: {
    fontSize: 20,
  },
  messageText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  messageTextDesktop: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerDesktop: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 40,
    paddingTop: 24,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDesktop: {
    padding: 22,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButtonTextDesktop: {
    fontSize: 19,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalContentDesktop: {
    padding: 48,
    maxWidth: 500,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTitleDesktop: {
    fontSize: 28,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalSubtitleDesktop: {
    fontSize: 18,
    lineHeight: 28,
  },
  modalButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
