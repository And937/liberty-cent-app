
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
import { getFirebase } from '@/lib/firebase';

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
  const { auth } = getFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        setIdToken(token);
      } else {
        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);


  const sendVerificationEmail = async (userParam?: User | null) => {
    const targetUser = userParam || auth.currentUser;
    if (targetUser) {
      await sendEmailVerification(targetUser);
    } else {
      throw new Error("No user is available to send a verification email.");
    }
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        await sendVerificationEmail(userCredential.user);
    }
    return userCredential;
  };

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
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

  // We don't render children until the first auth check is complete.
  // This avoids showing a "logged out" state for a split second on page load.
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};