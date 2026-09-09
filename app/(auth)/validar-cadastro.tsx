import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusCard } from '../../src/components/StatusCard';
import { colors, spacing, typography } from '../../src/theme';

export default function ValidarCadastroScreen() {
  const router = useRouter();
  const { nome, cpf, email } = useLocalSearchParams<{ nome: string; cpf: string; email: string }>();

  function handleConfirmar() {
    router.push({
      pathname: '/(auth)/criar-senha',
      params: { nome, cpf, email },
    });
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Confirme seus dados"
        subtitle="Revise as informações antes de criar sua senha."
        level="page"
      />

      <StatusCard>
        <View style={styles.row}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{nome}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>CPF</Text>
          <Text style={styles.value}>{cpf}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </StatusCard>

      <Button label="Confirmar" onPress={handleConfirmar} style={styles.button} />
      <Button label="Corrigir dados" variant="secondary" onPress={() => router.back()} style={styles.backButton} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.md },
  label: { ...typography.secondaryInfo, color: colors.textSecondary },
  value: { ...typography.subtitle, fontWeight: '600', color: colors.textPrimary, marginTop: spacing.xs / 2 },
  button: { marginTop: spacing.md },
  backButton: { marginTop: spacing.md },
});
