
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
          await currentUser.reload(); // Always reload to get latest emailVerified status
          const freshUser = firebaseAuth.currentUser;
          setUser(freshUser);

          if (freshUser) {
              try {
                  const token = await freshUser.getIdToken(true); // Force refresh token
                  setIdToken(token);
              } catch (error) {
                  console.error("Error getting ID token:", error);
                  setIdToken(null);
                  await signOut(firebaseAuth); // Sign out on token error
              }
          }
      } else {
          setUser(null);
          setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendVerificationEmail = async (userParam?: User | null) => {
    const targetUser = userParam || user;
    if (targetUser) {
      await sendEmailVerification(targetUser);
    } else {
      throw new Error("No user is available to send a verification email.");
    }
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
    return userCredential;
  };

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(firebaseAuth, email, pass);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};