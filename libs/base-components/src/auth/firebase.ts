import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase web configuration is public; credentials remain on the backend.
export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyA7KlwZjN8qMUsP3vlKBVYPPgEAOcK_V8c',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'artsgoz-artsgoz-web-develop.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'artsgoz-artsgoz-web-develop',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'artsgoz-artsgoz-web-develop.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '78095182747',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:78095182747:web:36aa85a087341efc194f3e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-REJP73NTZX',
};

export const firebaseApp = getApps().some((app) => app.name === '[DEFAULT]')
  ? getApp()
  : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

if (
  typeof window !== 'undefined' &&
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
) {
  void import('firebase/analytics')
    .then(async ({ isSupported, getAnalytics }) => {
      if (await isSupported()) getAnalytics(firebaseApp);
    })
    .catch(() => {
      /* Analytics availability must not prevent login. */
    });
}
