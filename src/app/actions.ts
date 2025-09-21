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
export async function createUser(data: { uid: string; email: string, idToken: string, referralCode?: string | null }) {
  try {
    // The token here is to ensure the call is from an auth'd user.
    await verifyToken(data.idToken);

    if (!adminDb) {
        throw new Error('Firestore is not initialized.');
    }

    const userRef = adminDb.collection('users').doc(data.uid);
    
    // Generate a unique referral code from the user's UID
    const newReferralCode = data.uid.substring(0, 8);
    
    let initialBalance = 0;

    // Handle referral logic
    if (data.referralCode) {
      const trimmedCode = data.referralCode.trim();
      const usersCollection = adminDb.collection('users');
      const query = usersCollection.where('referralCode', '==', trimmedCode).limit(1);
      const snapshot = await query.get();

      if (!snapshot.empty) {
        const referrerDoc = snapshot.docs[0];
        // Ensure user doesn't refer themselves (by using their own code, which is impossible at signup, but good practice)
        if (referrerDoc.id !== data.uid) {
            initialBalance = 10; // New user gets 10 CENT
            // Update referrer's balance
            const referrerRef = usersCollection.doc(referrerDoc.id);
            await referrerRef.update({
              balance: FieldValue.increment(300) // Referrer gets 300 CENT
            });
        }
      }
      // If referral code is invalid, initialBalance remains 0. We don't throw an error.
    }


    await userRef.set({
      email: data.email,
      balance: initialBalance,
      referralCode: newReferralCode,
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating user in Firestore:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getUserBalance(data: { idToken: string }): Promise<{ success: boolean; balance?: number; referralCode?: string; error?: string }> {
  try {
    const decodedToken = await verifyToken(data.idToken);
    const userId = decodedToken.uid;

    if (!adminDb) {
        throw new Error('Firestore is not initialized.');
    }

    const userRef = adminDb.collection('users').doc(userId);
    const docSnap = await userRef.get();
    
    let userData = docSnap.data();
    let referralCode = userData?.referralCode;

    // If the user document exists but is missing a referral code, generate and save one.
    if (docSnap.exists && !referralCode) {
      console.warn(`Referral code not found for uid: ${userId}. Creating it now.`);
      const newReferralCode = userId.substring(0, 8);
      await userRef.update({ referralCode: newReferralCode });
      referralCode = newReferralCode; // Use the new code for the return value
    } else if (!docSnap.exists) {
      // If the user doc doesn't exist at all, create it.
      console.warn(`User document not found for uid: ${userId}. Creating it now.`);
      const newReferralCode = userId.substring(0, 8);
      await userRef.set({
        email: decodedToken.email,
        balance: 0,
        referralCode: newReferralCode,
      });
      return { success: true, balance: 0, referralCode: newReferralCode };
    }

    // Safely access balance, default to 0 if it doesn't exist.
    const balance = userData?.balance ?? 0;

    return { success: true, balance, referralCode };
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