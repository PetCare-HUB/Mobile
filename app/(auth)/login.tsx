import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppInput } from '../../src/components/AppInput';
import { Button } from '../../src/components/Button';
import { colors, radius, spacing, typography } from '../../src/theme';
import { useAuth } from '../../src/contexts/auth/AuthContext';

const PAW_DECORATIONS = [
  { top: 18, left: '8%', size: 34, opacity: 0.16, rotate: '-18deg' },
  { top: 70, left: '78%', size: 46, opacity: 0.14, rotate: '12deg' },
  { top: 130, left: '20%', size: 26, opacity: 0.12, rotate: '6deg' },
  { top: 10, left: '55%', size: 22, opacity: 0.14, rotate: '-8deg' },
] as const;

export default function LoginScreen() {
  const router = useRouter();
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
    <View style={styles.screen}>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.greenSecondary, colors.greenPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {PAW_DECORATIONS.map((paw, index) => (
          <MaterialCommunityIcons
            key={index}
            name="paw"
            size={paw.size}
            color="#FFFFFF"
            style={{
              position: 'absolute',
              top: paw.top,
              left: paw.left,
              opacity: paw.opacity,
              transform: [{ rotate: paw.rotate }],
            }}
          />
        ))}
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons name="paw" size={26} color="#FFFFFF" />
            <Text style={styles.logo}>PetCare Hub</Text>
          </View>
          <Text style={styles.tagline}>Cuidado hoje. Mais vida amanhã.</Text>
        </SafeAreaView>
      </View>

      <View style={styles.card}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tabs}>
            <View style={styles.tabActive}>
              <Text style={styles.tabActiveText}>Entrar</Text>
            </View>
            <TouchableOpacity
              style={styles.tabInactive}
              onPress={() => router.push('/(auth)/primeiro-acesso')}
            >
              <Text style={styles.tabInactiveText}>Primeiro acesso</Text>
            </TouchableOpacity>
          </View>

          <AppInput
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="email-outline"
          />
          <AppInput
            label="Senha"
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-outline"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {slowConnection && (
            <Text style={styles.slowNotice}>
              Conectando ao servidor... isso pode levar até um minuto.
            </Text>
          )}

          <Button label="Entrar" onPress={handleLogin} loading={loading} style={styles.button} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.firstAccessRow}
            onPress={() => router.push('/(auth)/primeiro-acesso')}
          >
            <View style={styles.firstAccessIcon}>
              <MaterialCommunityIcons name="paw" size={18} color={colors.greenPrimary} />
            </View>
            <View style={styles.firstAccessText}>
              <Text style={styles.firstAccessTitle}>Primeiro acesso</Text>
              <Text style={styles.firstAccessDescription}>
                Utilize seu CPF, e-mail e código de ativação fornecidos pela sua clínica.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 220,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { ...typography.pageTitle, color: '#FFFFFF' },
  tagline: { ...typography.body, color: '#FFFFFF', marginTop: spacing.xs, opacity: 0.9 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    marginTop: -spacing.xl,
  },
  cardContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundGray,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.greenPrimary,
  },
  tabActiveText: { ...typography.subtitle, color: colors.surface },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabInactiveText: { ...typography.subtitle, fontWeight: '400', color: colors.textSecondary },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -spacing.xs, marginBottom: spacing.lg },
  forgotPasswordText: { ...typography.secondaryInfo, color: colors.bluePrimary },
  slowNotice: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  button: { marginBottom: spacing.xl },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderGray },
  dividerText: { ...typography.secondaryInfo, color: colors.textSecondary, marginHorizontal: spacing.md },
  firstAccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.cardSm,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  firstAccessIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  firstAccessText: { flex: 1 },
  firstAccessTitle: { ...typography.subtitle, color: colors.textPrimary },
  firstAccessDescription: { ...typography.secondaryInfo, color: colors.textSecondary, marginTop: spacing.xs / 2 },
});
