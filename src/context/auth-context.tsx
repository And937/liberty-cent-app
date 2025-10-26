
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
import { auth as firebaseAuth } from '@/lib/firebase-config';

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
  
  const handleUser = useCallback(async (rawUser: User | null) => {
      if (rawUser) {
          // Always reload to get the latest user state from Firebase servers
          await rawUser.reload();
          // After reloading, get the fresh user object
          const freshUser = firebaseAuth.currentUser;
          setUser(freshUser);

          if (freshUser && freshUser.emailVerified) {
              try {
                  // Force refresh the token to get latest claims
                  const token = await freshUser.getIdToken(true);
                  setIdToken(token);
              } catch (error) {
                  console.error("Error getting ID token:", error);
                  setIdToken(null);
                  await signOut(firebaseAuth); // Sign out on token error
              }
          } else {
              // User is not verified or is null, clear token
              setIdToken(null);
          }
      } else {
          setUser(null);
          setIdToken(null);
      }
      setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);

  const sendVerificationEmail = async (userParam?: User | null) => {
    const targetUser = userParam || firebaseAuth.currentUser;
    if (targetUser) {
      await sendEmailVerification(targetUser);
    } else {
      throw new Error("No user is available to send a verification email.");
    }
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
    // The onAuthStateChanged listener will handle the user state
    return userCredential;
  };

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
    // Manually trigger a state update after login to ensure freshness
    await handleUser(userCredential.user);
    return userCredential;
  };

  const logout = () => {
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};