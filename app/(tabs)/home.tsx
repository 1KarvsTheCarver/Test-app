import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, db } from '../../lib/firebase';
import { User, DailyCheckIn } from '../../types';
import { Button } from '../../components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.replace('/');
        return;
      }

      // Load user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      }

      // Load recent check-ins
      const checkInsQuery = query(
        collection(db, 'dailyCheckIns'),
        where('uid', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(7)
      );
      const checkInsSnapshot = await getDocs(checkInsQuery);
      const checkIns = checkInsSnapshot.docs.map(doc => doc.data() as DailyCheckIn);
      setRecentCheckIns(checkIns);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Welcome Back! 👋
              </Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-gray-100 px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-700">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Streak Counter */}
          <View className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-6">
            <Text className="text-white text-center text-lg mb-2">
              Current Streak
            </Text>
            <View className="items-center">
              <Text className="text-white text-6xl font-bold mb-2">
                {user?.streakCount || 0}
              </Text>
              <Text className="text-white text-xl">
                {user?.streakCount === 1 ? 'Day' : 'Days'}
              </Text>
            </View>
            <View className="flex-row justify-around mt-4 pt-4 border-t border-white/30">
              <View className="items-center">
                <Text className="text-white/80 text-sm">Total Check-ins</Text>
                <Text className="text-white text-2xl font-bold">
                  {user?.totalCheckIns || 0}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white/80 text-sm">Last Check-in</Text>
                <Text className="text-white text-2xl font-bold">
                  {user?.lastCheckInDate ? 'Today' : 'Never'}
                </Text>
              </View>
            </View>
          </View>

          {/* Anchor Verse */}
          {user?.anchorVerse && (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <Text className="text-sm text-gray-600 mb-2">Your Anchor Verse</Text>
              <Text className="text-base italic mb-2 text-gray-900">
                "{user.anchorVerse.text}"
              </Text>
              <Text className="text-sm text-gray-600">
                — {user.anchorVerse.reference}
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-3 text-gray-900">Quick Actions</Text>

            <TouchableOpacity
              className="bg-blue-600 rounded-xl p-4 mb-3"
              onPress={() => router.push('/(tabs)/checkin')}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">✓</Text>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg">
                    Daily Check-In
                  </Text>
                  <Text className="text-blue-100">
                    How are you doing today?
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border-2 border-gray-200 rounded-xl p-4"
              onPress={() => router.push('/(tabs)/review')}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">⭐</Text>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-lg">
                    View Coach Review
                  </Text>
                  <Text className="text-gray-600">
                    See your latest feedback
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          {recentCheckIns.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3 text-gray-900">
                Recent Check-Ins
              </Text>

              {recentCheckIns.slice(0, 5).map((checkIn, index) => (
                <View
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 mb-2 flex-row items-center"
                >
                  <View
                    className={`w-3 h-3 rounded-full mr-3 ${
                      checkIn.status === 'clean'
                        ? 'bg-green-500'
                        : checkIn.status === 'struggled'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <Text className="flex-1 text-gray-700">{checkIn.date}</Text>
                  <Text className="text-gray-600 capitalize">
                    {checkIn.status}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
