
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import it into any client-side code.

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

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

adminDb = admin.firestore();
adminAuth = admin.auth();

export { adminDb, adminAuth };
export default admin.app();
    