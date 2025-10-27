
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import it into any client-side code.

if (!admin.apps.length) {
  try {
    // Using applicationDefault credentials relies on the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable being set in your deployment environment.
    // This is the recommended approach for secure environments like production servers.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: "centswap.appspot.com",
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error. Make sure GOOGLE_APPLICATION_CREDENTIALS environment variable is set.", error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin.app();
