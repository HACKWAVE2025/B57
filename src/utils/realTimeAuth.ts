import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import { User } from "../types";

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

class RealTimeAuthService {
  private googleAccessToken: string | null = null;
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    const storedToken = localStorage.getItem("google_access_token");
    if (storedToken) {
      this.googleAccessToken = storedToken;
      console.log("🔄 Restored Google access token from localStorage");
    }

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        this.currentUser = userData;
      } else {
        this.currentUser = null;
        this.googleAccessToken = null;
        localStorage.removeItem("google_access_token");
      }

      this.authStateListeners.forEach((listener) => listener(this.currentUser));
    });
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);

    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential && credential.accessToken) {
        this.googleAccessToken = credential.accessToken;
        console.log("✅ Google OAuth successful with access token");
        localStorage.setItem("google_access_token", this.googleAccessToken);
      } else {
        console.log("❌ No Google access token received");
        this.googleAccessToken = null;
      }

      const userData: User = {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          ...userData,
          lastLoginAt: new Date().toISOString(),
          authProvider: "google",
          hasGoogleDriveAccess: !!this.googleAccessToken,
        },
        {
          merge: true,
        }
      );

      return {
        success: true,
        message: "Google sign-in successful",
        user: userData,
      };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      return { success: false, message: this.getErrorMessage(error.code) };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("🔄 Starting logout process...");

      this.googleAccessToken = null;
      localStorage.removeItem("google_access_token");

      this.currentUser = null;
      console.log("✅ Current user data cleared");

      await signOut(auth);
      console.log("✅ Firebase sign out successful");

      localStorage.removeItem("user_session");

      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
      this.googleAccessToken = null;
      this.currentUser = null;
      localStorage.removeItem("google_access_token");
      localStorage.removeItem("user_session");
      throw error;
    }
  }

  private async getUserData(uid: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      throw new Error("User data not found");
    } catch (error) {
      const firebaseUser = auth.currentUser;
      return {
        id: uid,
        username: firebaseUser?.displayName || "Unknown",
        email: firebaseUser?.email || "",
        createdAt: new Date().toISOString(),
      };
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled";
      case "auth/popup-blocked":
        return "Pop-up was blocked. Please allow pop-ups and try again";
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with this email using a different sign-in method";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      default:
        return "An error occurred during sign-in. Please try again";
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const realTimeAuth = new RealTimeAuthService();

