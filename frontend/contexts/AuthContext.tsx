"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface OfficerAuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  isOfficer?: boolean;
  badgeNumber?: string;
  station?: string;
}

interface AuthContextType {
  user: OfficerAuthUser | User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithSecretCode: (code: string, officerName?: string, badge?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithSecretCode: async () => ({ success: false }),
  logout: async () => {},
});

const DEFAULT_SECRET_CODES = [
  "CG-OFFICER-2026",
  "CHILDGUARD2026",
  "POLICE112",
  "OFFICER112"
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<OfficerAuthUser | User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if officer is authenticated via secret code in localStorage
    try {
      const stored = localStorage.getItem("childguard_officer_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.uid) {
          setUser(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Session retrieval failed", e);
    }

    // 2. Otherwise listen to Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signInWithSecretCode = async (
    code: string, 
    officerName = "Sub-Inspector R. Sawant", 
    badge = "IPS-4089"
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    const envCode = (process.env.NEXT_PUBLIC_OFFICER_SECRET_CODE || "").trim().toUpperCase();

    const isMatch = DEFAULT_SECRET_CODES.some(c => c.toUpperCase() === cleanCode) || (envCode && envCode === cleanCode);

    if (isMatch) {
      const officerUser: OfficerAuthUser = {
        uid: `OFFICER-${badge.replace(/\s+/g, "") || "DUTY"}`,
        displayName: officerName || "Duty Officer",
        email: "dispatch.officer@childguard.gov.in",
        isOfficer: true,
        badgeNumber: badge || "IPS-4089",
        station: "Goa Central Police Headquarters"
      };

      try {
        localStorage.setItem("childguard_officer_session", JSON.stringify(officerUser));
      } catch (e) {}

      setUser(officerUser);
      return { success: true };
    }

    return { 
      success: false, 
      message: "Invalid Officer Security Code. Please enter the authorized department PIN." 
    };
  };

  const logout = async () => {
    try {
      localStorage.removeItem("childguard_officer_session");
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithSecretCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
