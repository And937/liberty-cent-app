
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  sendEmailVerification,
} from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from '@/lib/firebase-admin-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  signup: (email: string, pass: string) => Promise<UserCredential>;
  login: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendVerificationEmail: (user?: User | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  
  // Store Firebase instances in state to ensure they are stable
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);

  useEffect(() => {
    // This effect runs once on mount to initialize Firebase
    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    setFirebaseAuth(getAuth(app));
  }, []);
  
  const handleUser = useCallback(async (rawUser: User | null) => {
      if (rawUser && firebaseAuth) {
          // It's important to get the latest state of the user object
          await rawUser.reload();
          const freshUser = firebaseAuth.currentUser;
          setUser(freshUser);

          if (freshUser && freshUser.emailVerified) {
              try {
                  const token = await freshUser.getIdToken(true);
                  setIdToken(token);
              } catch (error) {
                  console.error("Error getting ID token:", error);
                  setIdToken(null);
                  if (firebaseAuth) await signOut(firebaseAuth);
              }
          } else {
              setIdToken(null);
          }
      } else {
          setUser(null);
          setIdToken(null);
      }
      setLoading(false);
  }, [firebaseAuth]);


  useEffect(() => {
    // This effect runs when firebaseAuth is initialized
    if (firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
      return () => unsubscribe();
    }
  }, [firebaseAuth, handleUser]);

  const sendVerificationEmail = async (userParam?: User | null) => {
    if (!firebaseAuth) throw new Error("Firebase Auth not initialized.");
    const targetUser = userParam || firebaseAuth.currentUser;
    if (targetUser) {
      await sendEmailVerification(targetUser);
    } else {
      throw new Error("No user is available to send a verification email.");
    }
  };

  const signup = async (email: string, pass: string) => {
    if (!firebaseAuth) throw new Error("Firebase Auth not initialized.");
    return createUserWithEmailAndPassword(firebaseAuth, email, pass);
  };

  const login = async (email: string, pass: string) => {
    if (!firebaseAuth) throw new Error("Firebase Auth not initialized.");
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
    await handleUser(userCredential.user);
    return userCredential;
  };

  const logout = () => {
    if (!firebaseAuth) throw new Error("Firebase Auth not initialized.");
    return signOut(firebaseAuth);
  };

  const value = {
    user,
    loading,
    idToken,
    signup,
    login,
    logout,
    sendVerificationEmail,
  };

  // Render children only when loading is complete to avoid flicker
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

    