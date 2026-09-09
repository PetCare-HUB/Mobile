import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as authService from '../../services/auth/authService';
import { setUnauthorizedHandler } from '../../services/api/client';
import type { LoginResponse } from '../../services/auth/authService';

const STORAGE_KEY = 'petcarehub_auth';

type AuthState = {
  token: string | null;
  role: string | null;
  tutorId: number | null;
  clinicaId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string, onSlowConnection?: () => void) => Promise<void>;
  ativarConta: (
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    onSlowConnection?: () => void
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function persistSession(session: LoginResponse) {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    tutorId: null,
    clinicaId: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    async function rehydrate() {
      try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (raw) {
          const session: LoginResponse = JSON.parse(raw);
          setState({
            token: session.token,
            role: session.role,
            tutorId: session.tutorId ?? null,
            clinicaId: session.clinicaId ?? null,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      } catch {
        // sessão corrompida ou ausente — segue como não autenticado
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    rehydrate();
  }, []);

  const sessionExpiredHandledRef = useRef(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (sessionExpiredHandledRef.current) return;
      sessionExpiredHandledRef.current = true;
      Alert.alert('Sessão expirada', 'Sua sessão expirou. Faça login novamente.');
      logout();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  function applySession(session: LoginResponse) {
    sessionExpiredHandledRef.current = false;
    setState({
      token: session.token,
      role: session.role,
      tutorId: session.tutorId ?? null,
      clinicaId: session.clinicaId ?? null,
      isLoading: false,
      isAuthenticated: true,
    });
  }

  async function login(email: string, password: string, onSlowConnection?: () => void) {
    const session = await authService.login(email, password, onSlowConnection);
    await persistSession(session);
    applySession(session);
  }

  async function ativarConta(
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    onSlowConnection?: () => void
  ) {
    const session = await authService.ativarConta(nome, cpf, email, senha, onSlowConnection);
    await persistSession(session);
    applySession(session);
  }

  async function logout() {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setState({
      token: null,
      role: null,
      tutorId: null,
      clinicaId: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }

  const value = useMemo(
    () => ({ ...state, login, ativarConta, logout }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
}
