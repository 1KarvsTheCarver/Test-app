import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { User, DailyCheckIn } from '../../types';
import { FrictionModal } from '../../components/FrictionModal';
import { useScreenTime } from '../../hooks/useScreenTime';
import { showUsageAccessSettings } from '@justdice/react-native-usage-stats';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [user, setUser] = useState<User | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFrictionModal, setShowFrictionModal] = useState(false);

  // Screen time tracking (Android only)
  const { totalScreenTime, topApps, hasPermission, loading: screenTimeLoading } = useScreenTime();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    // Store screen time data in Firebase when it changes
    if (Platform.OS === 'android' && hasPermission && totalScreenTime > 0) {
      storeScreenTimeData();
    }
  }, [totalScreenTime, hasPermission]);

  const storeScreenTimeData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await addDoc(collection(db, 'screenTimeData'), {
        userId: currentUser.uid,
        timestamp: new Date(),
        totalScreenTime,
        topApps,
      });
    } catch (error) {
      console.error('Error storing screen time data:', error);
    }
  };

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

  const handleRequestPermission = async () => {
    try {
      await showUsageAccessSettings('Please grant usage access permission to track your screen time and help with accountability');
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const formatScreenTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean':
        return '#10b981';
      case 'struggled':
        return '#f59e0b';
      case 'relapsed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.welcomeText, isDesktop && styles.welcomeTextDesktop]}>
                Welcome Back!
              </Text>
              <Text style={styles.emailText}>{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Streak Counter */}
          <View style={[styles.streakCard, isDesktop && styles.streakCardDesktop]}>
            <View style={styles.streakHeader}>
              <Ionicons name="flame" size={isDesktop ? 48 : 40} color="#fff" />
              <Text style={[styles.streakLabel, isDesktop && styles.streakLabelDesktop]}>
                Current Streak
              </Text>
            </View>
            <Text style={[styles.streakNumber, isDesktop && styles.streakNumberDesktop]}>
              {user?.streakCount || 0}
            </Text>
            <Text style={styles.streakDays}>
              {user?.streakCount === 1 ? 'Day' : 'Days'}
            </Text>

            <View style={styles.streakStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Check-ins</Text>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  {user?.totalCheckIns || 0}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Last Check-in</Text>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  {user?.lastCheckInDate ? 'Today' : 'Never'}
                </Text>
              </View>
            </View>
          </View>

          {/* Screen Time Card (Android Only) */}
          {Platform.OS === 'android' && (
            <View style={styles.screenTimeCard}>
              <View style={styles.screenTimeHeader}>
                <View style={styles.screenTimeHeaderLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#7c3aed" />
                  <Text style={styles.screenTimeTitle}>Screen Time Today</Text>
                </View>
                {!hasPermission && (
                  <TouchableOpacity
                    onPress={handleRequestPermission}
                    style={styles.permissionButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.permissionButtonText}>Enable</Text>
                  </TouchableOpacity>
                )}
              </View>

              {screenTimeLoading ? (
                <View style={styles.screenTimeLoading}>
                  <ActivityIndicator size="small" color="#7c3aed" />
                  <Text style={styles.screenTimeLoadingText}>Loading screen time...</Text>
                </View>
              ) : !hasPermission ? (
                <View style={styles.screenTimePermissionPrompt}>
                  <Ionicons name="lock-closed-outline" size={32} color="#9ca3af" />
                  <Text style={styles.screenTimePermissionText}>
                    Enable screen time tracking to monitor your app usage and strengthen your accountability
                  </Text>
                  <TouchableOpacity
                    onPress={handleRequestPermission}
                    style={styles.enableButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.enableButtonText}>Grant Permission</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.screenTimeTotalContainer}>
                    <Text style={styles.screenTimeTotalLabel}>Total Screen Time</Text>
                    <Text style={styles.screenTimeTotalValue}>
                      {formatScreenTime(totalScreenTime)}
                    </Text>
                  </View>

                  {topApps.length > 0 && (
                    <View style={styles.topAppsContainer}>
                      <Text style={styles.topAppsTitle}>Most Used Apps</Text>
                      {topApps.map((app, index) => (
                        <View key={index} style={styles.appRow}>
                          <View style={styles.appInfo}>
                            <Text style={styles.appRank}>{index + 1}</Text>
                            <Text style={styles.appName}>{app.name}</Text>
                          </View>
                          <Text style={styles.appTime}>{formatScreenTime(app.timeInMinutes)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Anchor Verse */}
          {user?.anchorVerse && (
            <View style={styles.anchorVerseCard}>
              <View style={styles.anchorVerseHeader}>
                <Ionicons name="book-outline" size={20} color="#2563eb" />
                <Text style={styles.anchorVerseTitle}>Your Anchor Verse</Text>
              </View>
              <Text style={[styles.anchorVerseText, isDesktop && styles.anchorVerseTextDesktop]}>
                "{user.anchorVerse.text}"
              </Text>
              <Text style={styles.anchorVerseReference}>
                — {user.anchorVerse.reference}
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
              Quick Actions
            </Text>

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardPrimary, isDesktop && styles.actionCardDesktop]}
              onPress={() => router.push('/(tabs)/checkin')}
              activeOpacity={0.8}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardIcon}>
                  <Ionicons name="checkmark-circle" size={isDesktop ? 40 : 32} color="#fff" />
                </View>
                <View style={styles.actionCardText}>
                  <Text style={[styles.actionCardTitle, isDesktop && styles.actionCardTitleDesktop]}>
                    Daily Check-In
                  </Text>
                  <Text style={styles.actionCardSubtitle}>
                    How are you doing today?
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardSecondary, isDesktop && styles.actionCardDesktop]}
              onPress={() => router.push('/(tabs)/review')}
              activeOpacity={0.8}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardIcon}>
                  <Ionicons name="star" size={isDesktop ? 40 : 32} color="#2563eb" />
                </View>
                <View style={styles.actionCardText}>
                  <Text style={[styles.actionCardTitleSecondary, isDesktop && styles.actionCardTitleDesktop]}>
                    View Coach Review
                  </Text>
                  <Text style={styles.actionCardSubtitleSecondary}>
                    See your latest feedback
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#2563eb" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardWarning, isDesktop && styles.actionCardDesktop]}
              onPress={() => setShowFrictionModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardIcon}>
                  <Ionicons name="hand-left" size={isDesktop ? 40 : 32} color="#ef4444" />
                </View>
                <View style={styles.actionCardText}>
                  <Text style={[styles.actionCardTitleWarning, isDesktop && styles.actionCardTitleDesktop]}>
                    Need a Pause?
                  </Text>
                  <Text style={styles.actionCardSubtitleWarning}>
                    Take a moment to reflect
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ef4444" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Friction Modal */}
          <FrictionModal
            visible={showFrictionModal}
            onClose={() => setShowFrictionModal(false)}
            anchorVerse={user?.anchorVerse}
          />

          {/* Recent Activity */}
          {recentCheckIns.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
                Recent Check-Ins
              </Text>

              <View style={styles.checkInsList}>
                {recentCheckIns.slice(0, 5).map((checkIn, index) => (
                  <View
                    key={index}
                    style={[styles.checkInCard, isDesktop && styles.checkInCardDesktop]}
                  >
                    <View
                      style={[
                        styles.checkInStatusDot,
                        { backgroundColor: getStatusColor(checkIn.status) }
                      ]}
                    />
                    <Text style={[styles.checkInDate, isDesktop && styles.checkInDateDesktop]}>
                      {checkIn.date}
                    </Text>
                    <View style={styles.checkInStatusBadge}>
                      <Text style={[
                        styles.checkInStatus,
                        { color: getStatusColor(checkIn.status) }
                      ]}>
                        {checkIn.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {recentCheckIns.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={[styles.emptyStateTitle, isDesktop && styles.emptyStateTitleDesktop]}>
                No check-ins yet
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Start your accountability journey today!
              </Text>
            </View>
          )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  contentDesktop: {
    maxWidth: 1000,
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
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  welcomeTextDesktop: {
    fontSize: 36,
  },
  emailText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 50,
  },
  streakCard: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  streakCardDesktop: {
    padding: 40,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  streakLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 12,
    fontWeight: '600',
  },
  streakLabelDesktop: {
    fontSize: 22,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  streakNumberDesktop: {
    fontSize: 96,
  },
  streakDays: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statValueDesktop: {
    fontSize: 28,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  anchorVerseCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  anchorVerseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  anchorVerseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  anchorVerseText: {
    fontSize: 15,
    color: '#1e40af',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  anchorVerseTextDesktop: {
    fontSize: 17,
    lineHeight: 28,
  },
  anchorVerseReference: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitleDesktop: {
    fontSize: 26,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardDesktop: {
    padding: 24,
  },
  actionCardPrimary: {
    backgroundColor: '#2563eb',
  },
  actionCardSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  actionCardWarning: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCardIcon: {
    marginRight: 16,
  },
  actionCardText: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionCardTitleDesktop: {
    fontSize: 20,
  },
  actionCardTitleSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
  },
  actionCardSubtitleSecondary: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionCardTitleWarning: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  actionCardSubtitleWarning: {
    fontSize: 14,
    color: '#991b1b',
  },
  checkInsList: {
    gap: 12,
  },
  checkInCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInCardDesktop: {
    padding: 20,
  },
  checkInStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  checkInDate: {
    flex: 1,
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  checkInDateDesktop: {
    fontSize: 16,
  },
  checkInStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  checkInStatus: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
  },
  emptyStateTitleDesktop: {
    fontSize: 22,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  screenTimeCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  screenTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTimeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5b21b6',
    marginLeft: 8,
  },
  permissionButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  screenTimeLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  screenTimeLoadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#7c3aed',
  },
  screenTimePermissionPrompt: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  screenTimePermissionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    lineHeight: 20,
  },
  enableButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  enableButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  screenTimeTotalContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9d5ff',
  },
  screenTimeTotalLabel: {
    fontSize: 14,
    color: '#7c3aed',
    marginBottom: 8,
  },
  screenTimeTotalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5b21b6',
  },
  topAppsContainer: {
    paddingTop: 16,
  },
  topAppsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  appRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
    width: 24,
  },
  appName: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
  },
  appTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5b21b6',
  },
});
