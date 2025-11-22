
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import it into any client-side code.

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// Construct the service account from environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
    try {
        if (serviceAccount.projectId && serviceAccount.private_key) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: "centswap.appspot.com",
            });
            adminDb = admin.firestore();
            adminAuth = admin.auth();
            console.log("Firebase Admin SDK initialized successfully.");
        } else {
            console.error("Firebase Admin SDK not initialized: Missing environment variables.");
        }
    } catch (error: any) {
        console.error('Firebase admin initialization error', error.stack);
    }
} else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
}

export { adminDb, adminAuth };
export default admin.apps.length ? admin.app() : undefined;
