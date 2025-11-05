import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface FrictionModalProps {
  visible: boolean;
  onClose: () => void;
  anchorVerse?: {
    text: string;
    reference: string;
  };
}

export function FrictionModal({ visible, onClose, anchorVerse }: FrictionModalProps) {
  const [countdown, setCountdown] = useState(30);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (visible) {
      setCountdown(30);
      setCanDismiss(false);

      // Log friction event to Firebase
      logFrictionEvent('triggered');

      // Start 30-second countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanDismiss(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible]);

  const logFrictionEvent = async (action: string, remainingTime?: number) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await addDoc(collection(db, 'frictionEvents'), {
        userId: currentUser.uid,
        timestamp: new Date(),
        action,
        verseShown: anchorVerse?.reference || 'none',
        countdownRemaining: remainingTime || countdown,
      });
    } catch (error) {
      console.error('Error logging friction event:', error);
    }
  };

  const handleContinue = () => {
    logFrictionEvent('continued', countdown);
    onClose();
  };

  const handleExitApp = () => {
    logFrictionEvent('exited', countdown);
    // Note: React Native doesn't have a built-in way to close apps
    // This is intentional - apps should be backgrounded, not forced to close
    // User can manually close from app switcher
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={canDismiss ? onClose : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pauseIconContainer}>
            <Ionicons name="hand-left" size={48} color="#ef4444" />
          </View>
          <Text style={styles.title}>Take a Moment</Text>
          <Text style={styles.subtitle}>
            Let's pause and reflect before continuing
          </Text>
        </View>

        {/* Countdown Circle */}
        <View style={styles.countdownContainer}>
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>
        </View>

        {/* Anchor Verse */}
        {anchorVerse ? (
          <View style={styles.verseCard}>
            <Ionicons name="book-outline" size={24} color="#2563eb" style={styles.verseIcon} />
            <Text style={styles.verseText}>"{anchorVerse.text}"</Text>
            <Text style={styles.verseReference}>— {anchorVerse.reference}</Text>
          </View>
        ) : (
          <View style={styles.verseCard}>
            <Ionicons name="heart-outline" size={24} color="#2563eb" style={styles.verseIcon} />
            <Text style={styles.verseText}>
              "Take a deep breath. Remember why you started this journey."
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canDismiss && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!canDismiss}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={24} color="#ffffff" />
            <Text style={styles.continueButtonText}>
              {canDismiss ? 'Continue' : `Wait ${countdown}s`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleExitApp}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={24} color="#ef4444" />
            <Text style={styles.exitButtonText}>Exit App</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          This pause helps you make mindful choices. Your progress matters.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pauseIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  countdownCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#eff6ff',
    borderWidth: 4,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  verseCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  verseIcon: {
    marginBottom: 16,
  },
  verseText: {
    fontSize: 18,
    color: '#1e40af',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  exitButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});
