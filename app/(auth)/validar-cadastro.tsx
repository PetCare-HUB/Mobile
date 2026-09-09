import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusCard } from '../../src/components/StatusCard';
import { StepIndicator } from '../../src/components/StepIndicator';
import { colors, radius, spacing, typography } from '../../src/theme';

const ROWS: { key: 'nome' | 'cpf' | 'email'; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'nome', label: 'Nome', icon: 'account-outline' },
  { key: 'cpf', label: 'CPF', icon: 'card-account-details-outline' },
  { key: 'email', label: 'E-mail', icon: 'email-outline' },
];

export default function ValidarCadastroScreen() {
  const router = useRouter();
  const { nome, cpf, email } = useLocalSearchParams<{ nome: string; cpf: string; email: string }>();
  const data = { nome, cpf, email };

  function handleConfirmar() {
    router.push({
      pathname: '/(auth)/criar-senha',
      params: { nome, cpf, email },
    });
  }

  return (
    <ScreenContainer>
      <StepIndicator step={2} total={3} />

      <SectionHeader
        title="Confirme seus dados"
        subtitle="Revise as informações antes de criar sua senha."
        level="page"
      />

      <StatusCard>
        {ROWS.map((row, index) => (
          <View key={row.key} style={[styles.row, index === ROWS.length - 1 && styles.rowLast]}>
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name={row.icon} size={18} color={colors.greenPrimary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{data[row.key]}</Text>
            </View>
          </View>
        ))}
      </StatusCard>

      <Button label="Confirmar" onPress={handleConfirmar} style={styles.button} />
      <Button label="Corrigir dados" variant="secondary" onPress={() => router.back()} style={styles.backButton} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  rowLast: { paddingBottom: 0, marginBottom: 0, borderBottomWidth: 0 },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowText: { flex: 1 },
  label: { ...typography.secondaryInfo, color: colors.textSecondary },
  value: { ...typography.subtitle, fontWeight: '600', color: colors.textPrimary, marginTop: spacing.xs / 2 },
  button: { marginTop: spacing.md },
  backButton: { marginTop: spacing.md },
});
