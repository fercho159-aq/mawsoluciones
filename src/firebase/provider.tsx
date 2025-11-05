
'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, useContext, ReactNode, Suspense } from 'react';
import { FirebaseClientProvider } from './client-provider';

const FirebaseAppContext = createContext<FirebaseApp | undefined>(undefined);
const AuthContext = createContext<Auth | undefined>(undefined);
const FirestoreContext = createContext<Firestore | undefined>(undefined);

export function FirebaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense>
      <FirebaseClientProvider>{children}</FirebaseClientProvider>
    </Suspense>
  );
}

// Hooks to use Firebase services in components
export const useFirebaseApp = () => useContext(FirebaseAppContext);
export const useAuth = () => useContext(AuthContext);
export const useFirestore = () => useContext(FirestoreContext);
