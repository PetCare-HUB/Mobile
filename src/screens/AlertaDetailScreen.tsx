import { StyleSheet, Text } from 'react-native';

import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/EmptyState';
import { QueryState } from '../components/QueryState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';
import { usePetContext } from '../contexts/pet/PetContext';
import { usePetAlerts } from '../hooks/queries/usePetAlerts';
import { alertToUiShape } from '../utils/alertMappers';

type AlertaDetailScreenProps = {
  id: string;
};

export function AlertaDetailScreen({ id }: AlertaDetailScreenProps) {
  const { selectedPetId } = usePetContext();
  const alertsQuery = usePetAlerts(selectedPetId);

  const alerts = alertsQuery.data?.map(alertToUiShape) ?? [];
  const alert = alerts.find((item) => String(item.id) === id) ?? null;

  return (
    <ScreenContainer>
      <QueryState
        isLoading={alertsQuery.isLoading}
        isError={alertsQuery.isError}
        error={alertsQuery.error}
        data={alerts}
        onRetry={alertsQuery.refetch}
      >
        {() =>
          !alert ? (
            <EmptyState title="Alerta não encontrado" description="Este alerta pode já ter sido resolvido." />
          ) : (
            <>
              <SectionHeader title="Detalhe do alerta" subtitle={alert.timeAgo} level="page" />
              <AlertCard title={alert.title} message={alert.message} severity={alert.severity} />
              <Text style={styles.orientation}>
                Houve alteração no padrão recente. Observe o comportamento do pet e, caso a alteração
                persista, procure orientação da clínica responsável.
              </Text>
            </>
          )
        }
      </QueryState>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  orientation: { ...typography.body, color: colors.textSecondary, marginTop: spacing.lg },
});
