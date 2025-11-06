
'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, useContext, ReactNode } from 'react';

export const FirebaseAppContext = createContext<FirebaseApp | undefined>(undefined);
export const AuthContext = createContext<Auth | undefined>(undefined);
export const FirestoreContext = createContext<Firestore | undefined>(undefined);

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseAppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <FirestoreContext.Provider value={firestore}>
          {children}
        </FirestoreContext.Provider>
      </AuthContext.Provider>
    </FirebaseAppContext.Provider>
  );
}

// Hooks to use Firebase services in components
export const useFirebaseApp = () => useContext(FirebaseAppContext);
export const useAuth = () => useContext(AuthContext);
export const useFirestore = () => useContext(FirestoreContext);
