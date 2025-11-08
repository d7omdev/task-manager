import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import Constants from 'expo-constants';

// Firebase configuration
const getFirebaseConfig = () => ({
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

// Initialize Firebase lazily
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let initializationAttempted = false;

const initializeFirebase = () => {
    if (initializationAttempted && !firebaseApp) {
        return; // Already tried and failed
    }

    if (firebaseApp) {
        return; // Already initialized
    }

    initializationAttempted = true;

    const firebaseConfig = getFirebaseConfig();

    // Check if we have at least the project ID (required field)
    if (!firebaseConfig.projectId) {
        console.warn('Firebase not configured. Please set up Firebase credentials in .env or app.json');
        return;
    }

    try {
        if (!getApps().length) {
            firebaseApp = initializeApp(firebaseConfig);

            // Initialize Firestore with persistent local cache for offline support
            try {
                db = initializeFirestore(firebaseApp, {
                    localCache: persistentLocalCache(),
                });
            } catch (err: any) {
                // If persistence fails, fall back to regular getFirestore
                if (err.code === 'failed-precondition') {
                    console.warn('Firestore persistence failed: Multiple tabs open, using default cache');
                } else if (err.code === 'unimplemented') {
                    console.warn('Firestore persistence not available on this platform, using default cache');
                } else {
                    console.warn('Firestore persistence error, using default cache:', err);
                }
                db = getFirestore(firebaseApp);
            }

            auth = getAuth(firebaseApp);
            console.log('Firebase connected');
        } else {
            firebaseApp = getApps()[0];
            db = getFirestore(firebaseApp);
            auth = getAuth(firebaseApp);
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        // Don't throw - allow app to continue without Firebase
    }
};

// Lazy getters
export const getApp = (): FirebaseApp | null => {
    initializeFirebase();
    return firebaseApp;
};

export const getDb = (): Firestore | null => {
    initializeFirebase();
    return db;
};

export const getAuthInstance = (): Auth | null => {
    initializeFirebase();
    return auth;
};

// For backward compatibility - use getters instead of direct exports
// Note: These will be null if Firebase is not configured
// Use getApp(), getDb(), getAuthInstance() for type-safe access
export { firebaseApp as app };
export { db, auth };
