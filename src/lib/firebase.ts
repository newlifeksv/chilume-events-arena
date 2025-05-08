
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For security, in a production app, these values should be in environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: "chilume-events.firebaseapp.com",
  projectId: "chilume-events",
  storageBucket: "chilume-events.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper functions for AWS-style error handling
export const handleFirebaseError = (error: any) => {
  console.error("Firebase Error:", error);
  
  // AWS-style error messages with descriptive codes
  const errorMap: Record<string, string> = {
    'auth/invalid-email': 'INVALID_EMAIL: The email address is improperly formatted.',
    'auth/user-disabled': 'USER_DISABLED: The user account has been disabled.',
    'auth/user-not-found': 'USER_NOT_FOUND: There is no user record corresponding to this identifier.',
    'auth/wrong-password': 'INCORRECT_PASSWORD: The password is invalid.',
    'auth/email-already-in-use': 'EMAIL_IN_USE: The email address is already in use by another account.',
    'auth/operation-not-allowed': 'OPERATION_DENIED: This operation is not allowed.',
    'auth/weak-password': 'WEAK_PASSWORD: The password must be 6 characters long or more.',
  };

  if (error.code && errorMap[error.code]) {
    return errorMap[error.code];
  }
  
  return 'UNKNOWN_ERROR: An unexpected error occurred. Please try again.';
};
