
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import it into any client-side code.

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: "centswap.appspot.com",
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin.app();
