import { ConfigService } from '@nestjs/config';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

let firebaseApp: App | null = null;

function getFirebaseApp(configService: ConfigService): App {
  if (firebaseApp) return firebaseApp;
  const projectId = configService.getOrThrow<string>('FIREBASE_PROJECT_ID');
  const clientEmail = configService.getOrThrow<string>('FIREBASE_CLIENT_EMAIL');
  const privateKey = configService
    .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
    .replace(/\\n/g, '\n');

  firebaseApp =
    getApps()[0] ||
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

  return firebaseApp;
}

export function getFirebaseAuth(configService: ConfigService): Auth {
  const app = getFirebaseApp(configService);
  return getAuth(app);
}
