import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (data: {
    username: string;
    dob: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign up with extra data
  const signUp = useCallback(
    async ({
      username,
      dob,
      email,
      password,
    }: {
      username: string;
      dob: string;
      email: string;
      password: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        // Always use lowercase for username
        const usernameLower = username.toLowerCase();
        // Check if username already exists
        const usernameRef = doc(db, "usernames", usernameLower);
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
          setError("Username already taken");
          setLoading(false);
          return;
        }
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        // Store user data in Firestore
        await setDoc(doc(db, "users", uid), {
          username: usernameLower,
          dob,
          email,
          createdAt: new Date().toISOString(),
        });
        // Store username mapping
        await setDoc(usernameRef, { email, uid });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sign in with email or username
  const signIn = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      let email = identifier;
      // If not an email, treat as username (case-insensitive)
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
        const usernameLower = identifier.toLowerCase();
        const usernameRef = doc(db, "usernames", usernameLower);
        const usernameSnap = await getDoc(usernameRef);
        if (!usernameSnap.exists()) {
          setError("Username not found");
          setLoading(false);
          return;
        }
        email = usernameSnap.data().email;
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, signUp, signIn, signOutUser };
};
