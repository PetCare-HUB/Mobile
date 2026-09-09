import { StyleSheet, Text } from 'react-native';

import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';
import { homeAlerts } from '../data/mockData';

type AlertaDetailScreenProps = {
  id: string;
};

export function AlertaDetailScreen({ id }: AlertaDetailScreenProps) {
  const alert = homeAlerts.find((item) => String(item.id) === id);

  if (!alert) {
    return (
      <ScreenContainer>
        <EmptyState title="Alerta não encontrado" description="Este alerta pode já ter sido resolvido." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader title="Detalhe do alerta" level="page" />
      <AlertCard title={alert.title} message={alert.message} severity={alert.severity} />
      <Text style={styles.orientation}>
        Houve alteração no padrão recente. Observe o comportamento do pet e, caso a alteração
        persista, procure orientação da clínica responsável.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  orientation: { ...typography.body, color: colors.textSecondary, marginTop: spacing.lg },
});
