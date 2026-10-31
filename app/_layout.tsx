import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

import { queryClient } from '../src/services/api/queryClient';
import { AuthProvider, useAuth } from '../src/contexts/auth/AuthContext';
import { PetProvider } from '../src/contexts/pet/PetContext';
import { useAlertNotifications } from '../src/hooks/useAlertNotifications';
import { colors } from '../src/theme';

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Fica aqui, e nao numa tela, porque a notificacao precisa valer para o
  // app inteiro: o alerta pode nascer no backend enquanto o usuario esta em
  // qualquer aba. Precisa estar dentro de AuthProvider e PetProvider.
  useAlertNotifications();

  const inAuthGroup = segments[0] === '(auth)';
  // true enquanto a rota atual não bate com o estado de sessão - ainda não
  // redirecionou (o efeito abaixo faz isso). Usado só pra decidir o que
  // renderizar agora, nunca pra navegar durante o próprio render (isso foi
  // o que causou um loop de atualização com <Redirect> antes).
  const descompassado = !isLoading && ((!isAuthenticated && !inAuthGroup) || (isAuthenticated && inAuthGroup));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading || descompassado) {
    // Enquanto está descompassado, a tela protegida (ou a de login, se já
    // autenticado) nem chega a montar - fica essa tela em branco até o
    // efeito acima trocar de rota.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PetProvider>
            <RootNavigation />
            <StatusBar style="dark" />
          </PetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
