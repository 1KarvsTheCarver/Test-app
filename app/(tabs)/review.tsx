import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { CoachReview } from '../../types';

export default function ReviewScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading your reviews...</Text>
      </SafeAreaView>
    );
  }

  if (reviews.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="star-outline" size={80} color="#d1d5db" />
          </View>
          <Text style={[styles.emptyStateTitle, isDesktop && styles.emptyStateTitleDesktop]}>
            No Reviews Yet
          </Text>
          <Text style={[styles.emptyStateSubtitle, isDesktop && styles.emptyStateSubtitleDesktop]}>
            Your coach will review your progress and send feedback each week.
            Keep checking in daily to build your streak!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              Coach Reviews
            </Text>
            <View style={styles.reviewCount}>
              <Ionicons name="star" size={20} color="#f59e0b" />
              <Text style={styles.reviewCountText}>{reviews.length} Reviews</Text>
            </View>
          </View>

          {/* Reviews List */}
          {reviews.map((review, index) => {
            const scoreColor = getScoreColor(review.score);
            const scoreLabel = getScoreLabel(review.score);

            return (
              <View
                key={index}
                style={[styles.reviewCard, isDesktop && styles.reviewCardDesktop]}
              >
                {/* Card Header */}
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewHeaderLeft}>
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text style={styles.weekText}>
                      Week of {review.weekStartDate}
                    </Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                    <Text style={[styles.scoreNumber, isDesktop && styles.scoreNumberDesktop]}>
                      {review.score}
                    </Text>
                    <Text style={styles.scoreOutOf}>/100</Text>
                  </View>
                </View>

                {/* Score Label */}
                <View style={[styles.scoreLabelBadge, { backgroundColor: `${scoreColor}20` }]}>
                  <Ionicons name="trophy" size={16} color={scoreColor} />
                  <Text style={[styles.scoreLabelText, { color: scoreColor }]}>
                    {scoreLabel}
                  </Text>
                </View>

                {/* Score Breakdown */}
                <View style={styles.breakdownSection}>
                  <Text style={[styles.breakdownTitle, isDesktop && styles.breakdownTitleDesktop]}>
                    Score Breakdown
                  </Text>

                  <View style={styles.breakdownGrid}>
                    <View style={styles.breakdownItem}>
                      <View style={styles.breakdownItemHeader}>
                        <Ionicons name="flag-outline" size={18} color="#6b7280" />
                        <Text style={styles.breakdownItemLabel}>Goal Achievement</Text>
                      </View>
                      <Text style={[styles.breakdownItemValue, isDesktop && styles.breakdownItemValueDesktop]}>
                        {review.scoreBreakdown?.goalAchievement || 0}/40
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${((review.scoreBreakdown?.goalAchievement || 0) / 40) * 100}%`,
                              backgroundColor: scoreColor,
                            }
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.breakdownItem}>
                      <View style={styles.breakdownItemHeader}>
                        <Ionicons name="chatbubbles-outline" size={18} color="#6b7280" />
                        <Text style={styles.breakdownItemLabel}>Engagement</Text>
                      </View>
                      <Text style={[styles.breakdownItemValue, isDesktop && styles.breakdownItemValueDesktop]}>
                        {review.scoreBreakdown?.engagement || 0}/30
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${((review.scoreBreakdown?.engagement || 0) / 30) * 100}%`,
                              backgroundColor: scoreColor,
                            }
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.breakdownItem}>
                      <View style={styles.breakdownItemHeader}>
                        <Ionicons name="heart-outline" size={18} color="#6b7280" />
                        <Text style={styles.breakdownItemLabel}>Behavior</Text>
                      </View>
                      <Text style={[styles.breakdownItemValue, isDesktop && styles.breakdownItemValueDesktop]}>
                        {review.scoreBreakdown?.behavior || 0}/20
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${((review.scoreBreakdown?.behavior || 0) / 20) * 100}%`,
                              backgroundColor: scoreColor,
                            }
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.breakdownItem}>
                      <View style={styles.breakdownItemHeader}>
                        <Ionicons name="star-outline" size={18} color="#6b7280" />
                        <Text style={styles.breakdownItemLabel}>Bonus</Text>
                      </View>
                      <Text style={[styles.breakdownItemValue, isDesktop && styles.breakdownItemValueDesktop]}>
                        {review.scoreBreakdown?.bonus || 0}/10
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${((review.scoreBreakdown?.bonus || 0) / 10) * 100}%`,
                              backgroundColor: scoreColor,
                            }
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Coach Feedback */}
                <View style={styles.feedbackSection}>
                  <View style={styles.feedbackHeader}>
                    <Ionicons name="person-circle-outline" size={20} color="#2563eb" />
                    <Text style={[styles.feedbackTitle, isDesktop && styles.feedbackTitleDesktop]}>
                      Coach Feedback
                    </Text>
                  </View>
                  <Text style={[styles.feedbackText, isDesktop && styles.feedbackTextDesktop]}>
                    {review.reviewText}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.reviewFooter}>
                  <Ionicons name="time-outline" size={14} color="#9ca3af" />
                  <Text style={styles.reviewDate}>
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateTitleDesktop: {
    fontSize: 32,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 400,
  },
  emptyStateSubtitleDesktop: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 500,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  contentDesktop: {
    maxWidth: 900,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  titleDesktop: {
    fontSize: 36,
  },
  reviewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reviewCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 6,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewCardDesktop: {
    padding: 28,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreNumberDesktop: {
    fontSize: 32,
  },
  scoreOutOf: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 2,
  },
  scoreLabelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  scoreLabelText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  breakdownSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  breakdownTitleDesktop: {
    fontSize: 18,
  },
  breakdownGrid: {
    gap: 16,
  },
  breakdownItem: {
    marginBottom: 4,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownItemLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    fontWeight: '500',
  },
  breakdownItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  breakdownItemValueDesktop: {
    fontSize: 18,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  feedbackSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  feedbackTitleDesktop: {
    fontSize: 18,
  },
  feedbackText: {
    fontSize: 15,
    color: '#1e40af',
    lineHeight: 24,
  },
  feedbackTextDesktop: {
    fontSize: 16,
    lineHeight: 26,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
  },
});
