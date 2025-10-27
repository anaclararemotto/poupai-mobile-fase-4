import { AppUser } from '@/app/services/auth/auth.service';
import { auth } from '@/firebaseConfig';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// --- ALTERAÇÃO 1: Importar o 'signOut' ---
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // --- ALTERAÇÃO 2: Adicionar 'logout' à interface ---
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setUser(firebaseUser as AppUser | null);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("ERRO DE LOGIN NO CONTEXTO:", error);
      throw error;
    }
  };

  // --- ALTERAÇÃO 3: Implementar a função de logout ---
  const logout = async () => {
    try {
      await signOut(auth);
      // O onAuthStateChanged vai ser acionado automaticamente,
      // o 'user' se tornará 'null', e o _layout.js vai
      // redirecionar para a tela de Login.
    } catch (error) {
      console.error("ERRO AO SAIR:", error);
      throw error;
    }
  };


  const value = {
    user,
    authLoading,
    login,
    logout, // --- ALTERAÇÃO 4: Fornecer a função 'logout' ---
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};