import 'react-native-gesture-handler';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

import { queryClient } from '../src/services/api/queryClient';
import { AuthProvider, useAuth } from '../src/contexts/auth/AuthContext';
import { PetProvider } from '../src/contexts/pet/PetContext';
import { colors } from '../src/theme';

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  // Redirect (não router.replace num useEffect) decide isso durante o próprio
  // render: a tela privada nunca chega a montar sem sessão válida, nem por um
  // frame — não fica esperando um efeito rodar depois pra tirar ela da tela.
  const inAuthGroup = segments[0] === '(auth)';

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
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
