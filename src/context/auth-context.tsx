"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  signup: (email: string, pass: string) => Promise<UserCredential>;
  login: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
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

    // Refresh token every 10 minutes to maintain session
    const interval = setInterval(async () => {
        if (firebaseAuth.currentUser) {
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
  }, []);

  const signup = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, pass);
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
