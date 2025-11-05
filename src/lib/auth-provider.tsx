
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamMember } from './team-data';

interface AuthContextType {
  user: TeamMember | null;
  login: (user: TeamMember) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user info is in localStorage on initial load on the client side
    try {
      const storedUser = localStorage.getItem('team-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('team-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: TeamMember) => {
    try {
      localStorage.setItem('team-user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('team-user');
      setUser(null);
      router.push('/equipo');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
