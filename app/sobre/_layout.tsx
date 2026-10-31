import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function SobreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Sobre o app' }} />
    </Stack>
  );
}
