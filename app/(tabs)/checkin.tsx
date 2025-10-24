import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth, db } from '../../lib/firebase';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { CheckInStatus } from '../../types';

const checkInOptions: Array<{
  status: CheckInStatus;
  label: string;
  desc: string;
  emoji: string;
  color: string;
}> = [
  {
    status: 'clean',
    label: 'Clean Day',
    desc: 'I stayed on track today',
    emoji: '✅',
    color: 'green',
  },
  {
    status: 'struggled',
    label: 'Struggled',
    desc: 'I was tempted but resisted',
    emoji: '💪',
    color: 'yellow',
  },
  {
    status: 'slip',
    label: 'Minor Slip',
    desc: 'I slipped but caught myself',
    emoji: '⚠️',
    color: 'orange',
  },
  {
    status: 'relapse',
    label: 'Relapse',
    desc: 'I need to reset and start again',
    emoji: '🔄',
    color: 'red',
  },
];

export default function CheckInScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<CheckInStatus | ''>('');
  const [trigger, setTrigger] = useState('');
  const [loading, setLoading] = useState(false);

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

      Alert.alert(
        'Success!',
        'Your check-in has been recorded. Keep up the great work!',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelected('');
              setTrigger('');
              router.push('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting check-in:', error);
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          Daily Check-In ✓
        </Text>

        <Text className="text-gray-600 mb-6">How did today go for you?</Text>

        {checkInOptions.map((option) => (
          <TouchableOpacity
            key={option.status}
            className={`border-2 rounded-xl p-4 mb-3 ${
              selected === option.status
                ? `border-${option.color}-500 bg-${option.color}-50`
                : 'border-gray-200 bg-white'
            }`}
            onPress={() => setSelected(option.status)}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{option.emoji}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-900">
                  {option.label}
                </Text>
                <Text className="text-gray-600">{option.desc}</Text>
              </View>
              {selected === option.status && (
                <View className={`w-6 h-6 bg-${option.color}-500 rounded-full items-center justify-center`}>
                  <Text className="text-white font-bold">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {(selected === 'struggled' || selected === 'slip' || selected === 'relapse') && (
          <View className="mt-4">
            <Input
              label="What triggered this? (Optional)"
              placeholder="e.g., Boredom, stress, late night..."
              value={trigger}
              onChangeText={setTrigger}
              multiline
              numberOfLines={3}
            />

            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <Text className="text-sm text-gray-700">
                💡 <Text className="font-semibold">Identifying triggers</Text> helps
                you and your coach develop strategies to avoid them in the future.
              </Text>
            </View>
          </View>
        )}

        {selected === 'clean' && (
          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-green-900 mb-2">
              🎉 Amazing!
            </Text>
            <Text className="text-gray-700">
              Another day of victory! Keep building that streak.
            </Text>
          </View>
        )}

        {selected === 'relapse' && (
          <View className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-orange-900 mb-2">
              You're not alone
            </Text>
            <Text className="text-gray-700">
              Recovery isn't linear. What matters is that you're here, being honest,
              and ready to try again. Your coach will help you learn from this.
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 pb-6">
        <Button
          title="Submit Check-In"
          onPress={handleSubmit}
          loading={loading}
          disabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
}
