'use server';

import { auth } from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';

async function verifyToken(idToken: string | undefined | null) {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK not initialized.");
  }
  if (!idToken) {
    throw new Error("User not authenticated.");
  }
  try {
    return await auth().verifyIdToken(idToken);
  } catch (error: any) {
    console.error('Error verifying ID token:', error);
    throw new Error('Authentication token is invalid. Please log in again.');
  }
}

// Server action to create a user document in Firestore
export async function createUser(data: { uid: string; email: string, idToken: string }) {
  try {
    // The token here is to ensure the call is from an auth'd user.
    await verifyToken(data.idToken);

    if (!adminDb) {
        throw new Error('Firestore is not initialized.');
    }

    const userRef = adminDb.collection('users').doc(data.uid);
    // Use `set` with `merge: true` to avoid overwriting existing data, though it's a new user.
    await userRef.set({
      email: data.email,
      balance: 0,
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Error creating user in Firestore:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getUserBalance(data: { idToken: string }): Promise<{ success: boolean; balance?: number; error?: string }> {
  try {
    const decodedToken = await verifyToken(data.idToken);
    const userId = decodedToken.uid;

    if (!adminDb) {
        throw new Error('Firestore is not initialized.');
    }

    const userRef = adminDb.collection('users').doc(userId);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      // If the user doc doesn't exist, it means something went wrong during signup.
      // We can either create it here, or just return a 0 balance. Returning 0 is safer.
      console.warn(`User document not found for uid: ${userId}. Returning 0 balance.`);
      return { success: true, balance: 0 };
    }

    const userData = docSnap.data();
    // Safely access balance, default to 0 if it doesn't exist.
    const balance = userData?.balance ?? 0;

    return { success: true, balance: balance };
  } catch (error: any) {
    console.error("Error getting user balance:", error.message);
    // The error from verifyToken is already descriptive.
    return { success: false, error: error.message };
  }
}

export async function logTransaction(data: {
  idToken: string,
  centAmount: number,
  usdCost: number,
  paymentMethod: string,
  paymentAmount: string,
  paymentAddress: string,
  paymentMemo: string | undefined,
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decodedToken = await verifyToken(data.idToken);
    const { uid, email } = decodedToken;

    if (!adminDb) {
      throw new Error('Firestore is not initialized.');
    }

    const transactionRef = adminDb.collection('transactions').doc();
    await transactionRef.set({
      userId: uid,
      userEmail: email,
      centAmount: data.centAmount,
      usdCost: data.usdCost,
      paymentMethod: data.paymentMethod,
      paymentAmount: data.paymentAmount,
      paymentAddress: data.paymentAddress,
      paymentMemo: data.paymentMemo || null,
      status: 'pending_verification',
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error logging transaction:", error.message);
    return { success: false, error: error.message };
  }
}
