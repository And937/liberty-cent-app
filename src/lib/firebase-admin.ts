
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import it into any client-side code.

const serviceAccount: any = {
  "projectId": "centswap",
  "private_key_id": "e87413c21bd8d03ad4978f01ffbf35e1dbc05538",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7nzfbU044sguW\ndt22gc9dKcQRKKllq9fHuM1Ix2fmNjBAgJdb7L66a2HaYjSl3VxJ/9Z6w7CB86Oe\n55XwetJxpDLyHA7ryIshYbMQYZgF8oMYrZkmG9QPWh/ZJVdLDPa0O8vBp0Kg88Vx\nppAYKFqABqaTCkqw59No9IKVP39dWKxdz5K7HTEDU/+fd4xJMkXhHvbfIKh2Cfvk\n/cH/Er3pX8ivFMIj17hVLxpcBPRLHTALAWY8um0yx/B0UhrrWSDf2WloqxgmCbIq\ntZ+Cd37TyzTEJ/C372bkhMFjE4Luy3kpb23QOKXtecYlnryHYgEstRyowpmNPYC5\nGV6FEUW5AgMBAAECggEABfteEwqVaF5Y2zu/9uUtoNlHjIqA2CKB9zavqN3etKrO\noAfZi49BR31L+eP+rLkhi6RyCKj7lDEZ6uOUVr37vq7PBwQY/7B9qxtL075g0/O2\n9U73noztlm23rTsxDM4FgZqUdQCpsasEBQsb9gE3XXSY1ABUgE5r4aFGFo8XNvki\nTryPe6JJAjj3WRLneXDwZyjLfWWCuLK+WQTHKRtNcV8qO02juEa+udUa7Hps7Rfq\nYzAXBYqGHgqhJt4hl2ldRNHEHnm4usCqLyAkFoE8b46GcL6voAgP+8RohweA/OzD\nUzUxhuMExLgeDxkYibAq9Ety7ZdKUcuufriV4pEejwKBgQDhVwiqZArW3Illn/AU\nQrLw2SSoCCpILTETceF982zlxZ4nFyhX3uUm09nKZEEgpmq88nrFyox0nI1BJAVy\n7I4stEA/5M8AxLib2Gjr6JyWlWwLLNY//yZy3cWU9e7SIwEzzFn51li54oRBTbiw\ngsCP0jryCW5A7LBWP5AV02m4rwKBgQDVJmcSdleOlofCfDiP0AyNcDc9+FksAVza\ngwWzXdyKz1QmOO1UxyBjvEjoH8kLoadNiBSo8eX5AfP394A9tMw31rCCXy9wdBMp\nlRfPJkgT0u3F4+CADkdzV752rfN/bif3UtnxLdEEZQX2orUF+t2FJQKfnx5zFJNB\nlMlY+FiyFwKBgAulTtpXf0Ppc+Rfpq21YMAXyNAyU9UVGNMzcH7s5LTfSLQmezxH\nVbpy+m9+TOteDmgjc/ri4+2m5dn2/Z0Z4qMm0ac7sQMOJ6hOP+XpSKZzpHjTYWM/\nUYJgOcTgDO6pRneh2QiTblR1A3bIiIH+z+re55L4r80FLnvWnyCxo2YbAoGBAMBJ\nPp7HJ8G4RozK53PFai2GWC+NhVRPfmaZ4GCpgjWvR+ibXm8mnC+dQeA2HHZjxLwK\n0Sh/4Mk8W80M+CGyorCU+vMBz5gQ/uB6Ydo8XLWViW8GXhbnyslhFK+XyZzh0Sgr\nE/WhMXhXcoPG0KuuXnyooK9DKoMCwr1c7i9XCxzNAoGAOK4NvTYVoO+eOm5GKsps\nK8b5FVijwscYTlZ7JyV1ScoZwHLpFwpqzVZGW17d6VOOSnn6RqrXUmomeLEvg585\nYnZfbWvEewcWYPwopeSx8L3JOSB3cLFOr5wIRqr6ncHc1H9x37qkw66bLQFdfBhK\ndsO5XEe2dq3zcTDhNX5NmEQ=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@centswap.iam.gserviceaccount.com",
  "client_id": "106775025395337248521",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40centswap.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: "centswap.appspot.com",
        });
        adminDb = admin.firestore();
        adminAuth = admin.auth();
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
        console.error('Firebase admin initialization error', error.stack);
    }
} else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
}

export { adminDb, adminAuth };
export default admin.apps.length ? admin.app() : undefined;