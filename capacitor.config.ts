import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ritual.app',
  appName: 'Ritual',
  webDir: 'dist',
  backgroundColor: '#03020c',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#03020c',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#03020c',
      overlaysWebView: false,
    },
    Health: {
      android: {
        permissions: [
          "android.permission.ACTIVITY_RECOGNITION",
          "android.permission.BODY_SENSORS",
          "android.permission.ACCESS_FINE_LOCATION"
        ]
      }
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
