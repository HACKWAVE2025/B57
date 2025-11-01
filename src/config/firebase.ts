// Firebase configuration
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDF_LuEtxNFC1mj9qMtjdzGl2nIYKX7uzo",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "super-app-54ae9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "super-app-54ae9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "super-app-54ae9.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "305774764463",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:305774764463:web:50f80fbac56757cd998f5a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D25YP2476J",
};

// Initialize Firebase
console.log("Initializing Firebase...");
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully");
  
  auth = getAuth(app);
  console.log("✅ Firebase Auth initialized");
  
  db = getFirestore(app);
  console.log("✅ Firestore initialized");
  
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
  googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  googleProvider.addScope("https://www.googleapis.com/auth/drive.file");
  // Force account picker to always show
  googleProvider.setCustomParameters({
    prompt: "select_account"
  });
  console.log("✅ Google Auth Provider configured with account picker");
  
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  throw error;
}

// Export the initialized services
export { auth, db, googleProvider };
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export default app;



