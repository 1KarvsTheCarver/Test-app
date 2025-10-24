import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { CoachReview } from '../../types';

export default function ReviewScreen() {
  const [reviews, setReviews] = useState<CoachReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const reviewsQuery = query(
        collection(db, 'coachReviews'),
        where('uid', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const reviewsSnapshot = await getDocs(reviewsQuery);
      const loadedReviews = reviewsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as any[];

      setReviews(loadedReviews);

      // Mark unread reviews as read
      for (const review of loadedReviews) {
        if (!review.readAt) {
          await updateDoc(doc(db, 'coachReviews', review.id), {
            readAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Loading reviews...</Text>
      </SafeAreaView>
    );
  }

  if (reviews.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">⭐</Text>
          <Text className="text-2xl font-bold text-center mb-2 text-gray-900">
            No Reviews Yet
          </Text>
          <Text className="text-gray-600 text-center">
            Your coach will review your progress and send feedback each week.
            Keep checking in daily to build your streak!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-6 text-gray-900">
          Coach Reviews ⭐
        </Text>

        {reviews.map((review, index) => (
          <View key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-sm text-gray-600">
                  Week of {review.weekStartDate}
                </Text>
              </View>
              <View className="bg-blue-600 px-4 py-2 rounded-lg">
                <Text className="text-white font-bold text-2xl">
                  {review.score}/100
                </Text>
              </View>
            </View>

            {/* Score Breakdown */}
            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-3 text-gray-900">Score Breakdown</Text>

              <View className="space-y-2">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-700">Goal Achievement</Text>
                  <Text className="font-semibold text-gray-900">
                    {review.scoreBreakdown?.goalAchievement || 0}/40
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-700">Engagement</Text>
                  <Text className="font-semibold text-gray-900">
                    {review.scoreBreakdown?.engagement || 0}/30
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-700">Behavior</Text>
                  <Text className="font-semibold text-gray-900">
                    {review.scoreBreakdown?.behavior || 0}/20
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Bonus</Text>
                  <Text className="font-semibold text-gray-900">
                    {review.scoreBreakdown?.bonus || 0}/10
                  </Text>
                </View>
              </View>
            </View>

            {/* Review Text */}
            <View>
              <Text className="font-semibold mb-2 text-gray-900">Coach Feedback</Text>
              <Text className="text-gray-700 leading-6">{review.reviewText}</Text>
            </View>

            {/* Footer */}
            <View className="mt-4 pt-4 border-t border-gray-200">
              <Text className="text-xs text-gray-500">
                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
