
import { FirebaseApp, getApps, initializeApp, getApp as getExistingApp } from 'firebase/app';
import { Auth, getAuth as getFirebaseAuth } from 'firebase/auth';
import { Firestore, getFirestore as getFirebaseFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useAuth, useFirebaseApp, useFirestore } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

export { useAuth, useUser, useFirebaseApp, useFirestore, useCollection, useDoc };

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initialize() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getFirebaseAuth(app);
    firestore = getFirebaseFirestore(app);
  } else {
    app = getExistingApp();
    auth = getFirebaseAuth(app);
    firestore = getFirebaseFirestore(app);
  }
}

export function getApp() {
  if (!app) {
    initialize();
  }
  return app;
}

export function getAuth() {
  if (!auth) {
    initialize();
  }
  return auth;
}

export function getFirestore() {
  if (!firestore) {
    initialize();
  }
  return firestore;
}
