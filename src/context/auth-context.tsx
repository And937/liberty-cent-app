
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
                  await signOut(firebaseAuth);
              }
          } else {
              setIdToken(null);
          }
      } else {
          setUser(null);
          setIdToken(null);
      }
      setLoading(false);
  }, []);


  useEffect(() => {
    // onAuthStateChanged is the primary listener for auth state.
    // It handles initial load, signup, and logout.
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
    return createUserWithEmailAndPassword(firebaseAuth, email, pass);
  };

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
    // After login, we MUST manually trigger a reload to get the fresh emailVerified status.
    // The onAuthStateChanged listener might not be fast enough or might have a stale user object.
    await handleUser(userCredential.user);
    return userCredential;
  };

  const logout = () => {
    // onAuthStateChanged will handle setting user to null.
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