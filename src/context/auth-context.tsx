
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
      setUser(currentUser);
      if (currentUser) {
        try {
            const token = await currentUser.getIdToken();
            setIdToken(token);
        } catch (error) {
            console.error("Error getting ID token:", error);
            setIdToken(null);
        }
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    const interval = setInterval(async () => {
        if (firebaseAuth.currentUser) {
            await firebaseAuth.currentUser.reload();
            // Check if the user object reference has changed to avoid unnecessary state updates
            if (firebaseAuth.currentUser !== user) {
              setUser(firebaseAuth.currentUser);
            }
            try {
                const token = await firebaseAuth.currentUser.getIdToken(true);
                setIdToken(token);
            } catch (error) {
                console.error("Error refreshing token:", error);
                await signOut(firebaseAuth);
            }
        }
    }, 10 * 60 * 1000);

    return () => {
        unsubscribe();
        clearInterval(interval);
    };
  }, [user]);

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
    await sendVerificationEmail(userCredential.user);
    // We keep the user logged in but unverified.
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

    