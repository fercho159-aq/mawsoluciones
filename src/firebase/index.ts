
import { FirebaseApp, getApps, initializeApp, getApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useAuth, useFirebaseApp, useFirestore } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

export { useAuth, useUser, useFirebaseApp, useFirestore, useCollection, useDoc };

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
firestore = getFirestore(app);

export { app, auth, firestore };
