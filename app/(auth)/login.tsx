import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { AppInput } from '../../src/components/AppInput';
import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { colors, spacing, typography } from '../../src/theme';
import { useAuth } from '../../src/contexts/auth/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setSlowConnection(false);
    try {
      await login(email, password, () => setSlowConnection(true));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível entrar.';
      Alert.alert('Erro ao entrar', message);
    } finally {
      setLoading(false);
      setSlowConnection(false);
    }
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>🐾 PetCare Hub</Text>
        <Text style={styles.tagline}>Cuidado hoje. Mais vida amanhã.</Text>
      </View>

      <SectionHeader title="Entrar" subtitle="Acesse sua conta de tutor." />

      <AppInput
        label="E-mail"
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AppInput
        label="Senha"
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {slowConnection && (
        <Text style={styles.slowNotice}>
          Conectando ao servidor... isso pode levar até um minuto.
        </Text>
      )}

      <Button label="Entrar" onPress={handleLogin} loading={loading} style={styles.button} />

      <Link href="/(auth)/primeiro-acesso" asChild>
        <Text style={styles.link}>
          Primeiro acesso? Utilize seu CPF e e-mail fornecidos pela sua clínica.
        </Text>
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing['2xl'] },
  logo: { ...typography.hero, fontSize: 26, color: colors.textPrimary },
  tagline: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  slowNotice: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  button: { marginTop: spacing.sm },
  link: { ...typography.body, color: colors.bluePrimary, textAlign: 'center', marginTop: spacing.xl },
});
