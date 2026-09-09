import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { EmptyState } from '../components/EmptyState';
import { QueryState } from '../components/QueryState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { colors, radius, spacing, typography } from '../theme';
import { usePetContext } from '../contexts/pet/PetContext';
import { usePetAlerts } from '../hooks/queries/usePetAlerts';
import { alertToUiShape } from '../utils/alertMappers';
import type { AlertItem } from '../types/pet';

type FilterKey = 'todos' | 'importante' | 'atencao' | 'informativo';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'importante', label: 'Importante' },
  { key: 'atencao', label: 'Atenção' },
  { key: 'informativo', label: 'Informativo' },
];

const SEVERITY_BY_FILTER: Record<FilterKey, AlertItem['severity'] | null> = {
  todos: null,
  importante: 'high',
  atencao: 'medium',
  informativo: 'low',
};

const SEVERITY_STYLE: Record<AlertItem['severity'], { color: string; background: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  high: { color: colors.danger, background: '#FBE7E7', icon: 'alert-circle' },
  medium: { color: colors.warning, background: '#FDF1DF', icon: 'battery-alert-variant' },
  low: { color: colors.bluePrimary, background: colors.blueLight, icon: 'information' },
};

export function AlertasScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('todos');
  const { selectedPetId } = usePetContext();
  const alertsQuery = usePetAlerts(selectedPetId);

  const alerts = (alertsQuery.data ?? []).map(alertToUiShape);
  const severity = SEVERITY_BY_FILTER[filter];
  const filteredAlerts = severity ? alerts.filter((alert) => alert.severity === severity) : alerts;

  return (
    <ScreenContainer>
      <SectionHeader
        title="Alertas"
        subtitle="Acompanhe os sinais identificados nos sensores do pet."
        level="page"
      />

      <SegmentedControl segments={FILTERS} value={filter} onChange={setFilter} />

      <QueryState
        isLoading={alertsQuery.isLoading}
        isError={alertsQuery.isError}
        error={alertsQuery.error}
        data={alerts}
        onRetry={alertsQuery.refetch}
      >
        {() =>
          filteredAlerts.length === 0 ? (
            <EmptyState title="Nenhum alerta por aqui" description="Não há alertas nessa categoria no momento." />
          ) : (
            <>
              {filteredAlerts.map((alert) => {
                const style = SEVERITY_STYLE[alert.severity];
                return (
                  <TouchableOpacity
                    key={alert.id}
                    style={styles.row}
                    onPress={() => router.push(`/alertas/${alert.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.icon, { backgroundColor: style.background }]}>
                      <MaterialCommunityIcons name={style.icon} size={20} color={style.color} />
                    </View>
                    <View style={styles.text}>
                      <Text style={[styles.title, { color: style.color }]}>{alert.title}</Text>
                      <Text style={styles.timeAgo}>{alert.timeAgo}</Text>
                      <Text style={styles.message}>{alert.message}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
            </>
          )
        }
      </QueryState>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.cardSm,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  text: { flex: 1 },
  title: { ...typography.subtitle },
  timeAgo: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs / 2 },
  message: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
