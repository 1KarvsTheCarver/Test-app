import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  EventFrequency,
  checkForPermission,
  queryUsageStats,
  showUsageAccessSettings,
} from '@justdice/react-native-usage-stats';

interface AppUsage {
  packageName: string;
  totalTimeInForeground: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
}

interface ScreenTimeData {
  totalScreenTime: number;
  topApps: Array<{
    name: string;
    packageName: string;
    timeInMinutes: number;
  }>;
  hasPermission: boolean;
  loading: boolean;
}

// Map of common package names to user-friendly names
const APP_NAMES: Record<string, string> = {
  'com.instagram.android': 'Instagram',
  'com.zhiliaoapp.musically': 'TikTok',
  'com.snapchat.android': 'Snapchat',
  'com.twitter.android': 'Twitter',
  'com.facebook.katana': 'Facebook',
  'com.reddit.frontpage': 'Reddit',
  'com.google.android.youtube': 'YouTube',
  'com.netflix.mediaclient': 'Netflix',
  'com.spotify.music': 'Spotify',
};

export function useScreenTime(): ScreenTimeData {
  const [hasPermission, setHasPermission] = useState(false);
  const [totalScreenTime, setTotalScreenTime] = useState(0);
  const [topApps, setTopApps] = useState<Array<{
    name: string;
    packageName: string;
    timeInMinutes: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      setLoading(false);
      return;
    }

    checkPermissionAndFetchData();
  }, []);

  const checkPermissionAndFetchData = async () => {
    try {
      setLoading(true);

      // Check for permission
      const permissionGranted = await checkForPermission();
      setHasPermission(permissionGranted);

      if (!permissionGranted) {
        setLoading(false);
        return;
      }

      // Fetch usage stats for the last 24 hours
      const endTime = Date.now();
      const startTime = endTime - (24 * 60 * 60 * 1000); // 24 hours ago

      const usageStats = await queryUsageStats(
        EventFrequency.INTERVAL_DAILY,
        startTime,
        endTime
      );

      if (!usageStats || usageStats.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate total screen time and sort by usage
      let total = 0;
      const apps: Array<AppUsage> = [];

      usageStats.forEach((stat: any) => {
        const timeInForeground = stat.totalTimeInForeground || 0;

        // Only include apps with significant usage (more than 1 minute)
        if (timeInForeground > 60000) {
          total += timeInForeground;
          apps.push({
            packageName: stat.packageName,
            totalTimeInForeground: timeInForeground,
            firstTimeStamp: stat.firstTimeStamp,
            lastTimeStamp: stat.lastTimeStamp,
          });
        }
      });

      // Sort by usage time and take top 3
      apps.sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);
      const top3 = apps.slice(0, 3).map(app => ({
        name: APP_NAMES[app.packageName] || formatPackageName(app.packageName),
        packageName: app.packageName,
        timeInMinutes: Math.round(app.totalTimeInForeground / 60000),
      }));

      setTotalScreenTime(Math.round(total / 60000)); // Convert to minutes
      setTopApps(top3);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching screen time:', error);
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      await showUsageAccessSettings('Please grant usage access permission to track your screen time');

      // Wait a bit for the user to return from settings, then re-check
      setTimeout(async () => {
        const permissionGranted = await checkForPermission();
        setHasPermission(permissionGranted);
        if (permissionGranted) {
          checkPermissionAndFetchData();
        }
      }, 1000);
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const refresh = () => {
    checkPermissionAndFetchData();
  };

  // Format package name to user-friendly name
  const formatPackageName = (packageName: string): string => {
    // Remove domain parts (com.example.app -> app)
    const parts = packageName.split('.');
    const appName = parts[parts.length - 1];

    // Capitalize first letter
    return appName.charAt(0).toUpperCase() + appName.slice(1);
  };

  return {
    totalScreenTime,
    topApps,
    hasPermission,
    loading,
  };
}
