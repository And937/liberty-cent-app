
'use server';

import { auth } from 'firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
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
    let referredById: string | null = null;

    // Handle referral logic
    if (data.referralCode) {
      const trimmedCode = data.referralCode.trim();
      if (trimmedCode) {
          const usersCollection = adminDb.collection('users');
          const query = usersCollection.where('referralCode', '==', trimmedCode).limit(1);
          const snapshot = await query.get();

          if (!snapshot.empty) {
            const referrerDoc = snapshot.docs[0];
            // Ensure user doesn't refer themselves (by using their own code, which is impossible at signup, but good practice)
            if (referrerDoc.id !== data.uid) {
                initialBalance = 10; // New user gets 10 CENT
                referredById = referrerDoc.id;
                // Update referrer's balance
                const referrerRef = usersCollection.doc(referrerDoc.id);
                await referrerRef.update({
                  balance: FieldValue.increment(300) // Referrer gets 300 CENT
                });
            }
          }
      }
    }


    await userRef.set({
      email: data.email,
      balance: initialBalance,
      referralCode: newReferralCode,
      referredBy: referredById,
      createdAt: FieldValue.serverTimestamp(),
      lastBonusClaim: null,
      loginStreak: 0,
      verificationStatus: 'unverified',
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating user in Firestore:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getUserBalance(data: { idToken: string }): Promise<{ 
    success: boolean; 
    balance?: number; 
    referralCode?: string; 
    verificationStatus?: string;
    error?: string 
}> {
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
    let verificationStatus = userData?.verificationStatus || 'unverified';

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
        referredBy: null,
        createdAt: FieldValue.serverTimestamp(),
        lastBonusClaim: null,
        loginStreak: 0,
        verificationStatus: 'unverified',
      });
      return { success: true, balance: 0, referralCode: newReferralCode, verificationStatus: 'unverified' };
    }

    // Safely access balance, default to 0 if it doesn't exist.
    const balance = userData?.balance ?? 0;

    return { success: true, balance, referralCode, verificationStatus };
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
    
    // Check verification status
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists || userDoc.data()?.verificationStatus !== 'verified') {
        throw new Error("User must be verified to make a transaction.");
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

const getBonusAmount = (streak: number): number => {
    if (streak <= 0) return 10; // Day 1
    if (streak === 1) return 20; // Day 2
    if (streak === 2) return 30; // Day 3
    if (streak === 3) return 40; // Day 4
    if (streak === 4) return 50; // Day 5
    if (streak === 5) return 60; // Day 6
    return 100; // Day 7 and onwards
};

export async function getDailyBonusStatus(data: { idToken: string }): Promise<{
    success: boolean;
    error?: string;
    canClaim?: boolean;
    streak?: number;
    bonusAmount?: number;
    nextClaimTime?: number; // Unix timestamp in milliseconds
}> {
    try {
        const decodedToken = await verifyToken(data.idToken);
        const userRef = adminDb!.collection('users').doc(decodedToken.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // This case should ideally not happen if user is created on signup.
            return { success: true, canClaim: true, streak: 0, bonusAmount: 10 };
        }

        const userData = userDoc.data()!;
        const lastClaimTimestamp = userData.lastBonusClaim as Timestamp | null;
        let streak = userData.loginStreak || 0;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (!lastClaimTimestamp) {
            // User has never claimed a bonus before.
            return { success: true, canClaim: true, streak: 0, bonusAmount: getBonusAmount(0) };
        }

        const lastClaimDate = lastClaimTimestamp.toDate();
        const lastClaimDay = new Date(lastClaimDate.getFullYear(), lastClaimDate.getMonth(), lastClaimDate.getDate());
        
        if (lastClaimDay.getTime() >= today.getTime()) {
            // Already claimed today.
            return { success: true, canClaim: false, streak: streak, bonusAmount: getBonusAmount(streak), nextClaimTime: tomorrow.getTime() };
        }

        // Check if the streak is broken
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastClaimDay.getTime() < yesterday.getTime()) {
            streak = 0; // Streak is broken
        }

        return { success: true, canClaim: true, streak: streak, bonusAmount: getBonusAmount(streak) };

    } catch (error: any) {
        console.error("Error getting daily bonus status:", error.message);
        return { success: false, error: error.message };
    }
}


export async function claimDailyBonus(data: { idToken: string }): Promise<{
    success: boolean;
    error?: string;
    claimedAmount?: number;
    newBalance?: number;
    newStreak?: number;
}> {
    try {
        const decodedToken = await verifyToken(data.idToken);
        const userRef = adminDb!.collection('users').doc(decodedToken.uid);

        return await adminDb!.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error("User document does not exist.");
            }

            const userData = userDoc.data()!;
            const lastClaimTimestamp = userData.lastBonusClaim as Timestamp | null;
            let currentStreak = userData.loginStreak || 0;
            const currentBalance = userData.balance || 0;
            
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            if (lastClaimTimestamp) {
                const lastClaimDate = lastClaimTimestamp.toDate();
                const lastClaimDay = new Date(lastClaimDate.getFullYear(), lastClaimDate.getMonth(), lastClaimDate.getDate());
                if (lastClaimDay.getTime() >= today.getTime()) {
                    throw new Error("Bonus for today has already been claimed.");
                }

                // Check for streak
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastClaimDay.getTime() < yesterday.getTime()) {
                    currentStreak = 0; // Reset streak
                }
            }

            const newStreak = currentStreak + 1;
            const bonusToClaim = getBonusAmount(currentStreak);
            const newBalance = currentBalance + bonusToClaim;
            
            transaction.update(userRef, {
                balance: newBalance,
                loginStreak: newStreak,
                lastBonusClaim: Timestamp.now(),
            });

            return { success: true, claimedAmount: bonusToClaim, newBalance: newBalance, newStreak: newStreak };
        });

    } catch (error: any) {
        console.error("Error claiming daily bonus:", error.message);
        return { success: false, error: error.message };
    }
}

export async function submitVerificationRequest(data: { idToken: string; documentUrl: string; }): Promise<{ success: boolean; error?: string }> {
  try {
    const decodedToken = await verifyToken(data.idToken);
    const { uid } = decodedToken;

    if (!adminDb) {
      throw new Error('Firestore is not initialized.');
    }
    
    // Create a request in the verificationRequests collection
    const requestRef = adminDb.collection('verificationRequests').doc();
    await requestRef.set({
      userId: uid,
      documentUrl: data.documentUrl,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    // Update the user's status to pending
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
        verificationStatus: 'pending'
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting verification request:", error.message);
    return { success: false, error: error.message };
  }
}