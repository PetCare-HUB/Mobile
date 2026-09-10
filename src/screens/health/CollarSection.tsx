import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BarChart } from '../../components/BarChart';
import { BreakdownRow } from '../../components/BreakdownRow';
import { DeviceCard } from '../../components/DeviceCard';
import { QueryState } from '../../components/QueryState';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { useLeiturasColeira } from '../../hooks/queries/useLeiturasColeira';
import {
  STATUS_ATIVIDADE_ICON,
  STATUS_ATIVIDADE_LABEL,
  activityBars,
  batteryColor,
  batteryIcon,
  computeSinceLabel,
  computeTimeInState,
  filterByRange,
  type LeituraRange,
} from '../../utils/leituraMappers';

type CollarSectionProps = {
  petId: number;
};

const RANGE_SEGMENTS: { key: LeituraRange; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: '30dias', label: '30 dias' },
];

const BREAKDOWN_COLORS = [colors.bluePrimary, colors.warning, colors.greenSecondary];

export function CollarSection({ petId }: CollarSectionProps) {
  const [range, setRange] = useState<LeituraRange>('hoje');
  const leiturasQuery = useLeiturasColeira(petId);

  return (
    <QueryState
      isLoading={leiturasQuery.isLoading}
      isError={leiturasQuery.isError}
      error={leiturasQuery.error}
      data={leiturasQuery.data}
      isEmpty={(leituras) => leituras.length === 0}
      onRetry={leiturasQuery.refetch}
      emptyTitle="Nenhuma leitura registrada"
      emptyDescription="Assim que a coleira enviar dados, eles aparecem aqui."
    >
      {(todasLeituras) => {
        const leituras = filterByRange(todasLeituras, range);
        const atual = todasLeituras[0];
        const sinceLabel = computeSinceLabel(todasLeituras);
        const timeInState = computeTimeInState(leituras);
        const chart = activityBars(leituras, range);

        return (
          <>
            <DeviceCard
              icon="watch-variant"
              title="Coleira Smart"
              connected
              rightIcon={batteryIcon(atual.nivelBateria)}
              rightIconColor={batteryColor(atual.nivelBateria)}
              rightValue={`${atual.nivelBateria}%`}
            />

            <StatusCard style={styles.stateCard}>
              <View style={styles.stateRow}>
                <View style={styles.stateIcon}>
                  <MaterialCommunityIcons name={STATUS_ATIVIDADE_ICON[atual.statusAtividade]} size={22} color={colors.greenPrimary} />
                </View>
                <View>
                  <Text style={styles.stateLabel}>Estado atual</Text>
                  <Text style={styles.stateValue}>{STATUS_ATIVIDADE_LABEL[atual.statusAtividade]}</Text>
                  {sinceLabel ? <Text style={styles.stateSince}>Desde {sinceLabel}</Text> : null}
                </View>
              </View>
            </StatusCard>

            <SegmentedControl segments={RANGE_SEGMENTS} value={range} onChange={setRange} />

            <StatusCard>
              <Text style={styles.chartTitle}>Nível de atividade</Text>
              {chart.data.length > 0 ? (
                <BarChart data={chart.data} labels={chart.labels} color={colors.bluePrimary} />
              ) : (
                <Text style={styles.noDataText}>Sem leituras no período selecionado.</Text>
              )}
            </StatusCard>

            <StatusCard>
              <Text style={styles.chartTitle}>Tempo em cada estado</Text>
              <View style={{ marginTop: spacing.md }}>
                {timeInState.map((item, index) => (
                  <BreakdownRow
                    key={item.key}
                    color={BREAKDOWN_COLORS[index]}
                    label={item.label}
                    valueLabel={item.hours}
                    percent={item.percent}
                  />
                ))}
              </View>
            </StatusCard>
          </>
        );
      }}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  stateCard: { paddingVertical: spacing.md + 2 },
  stateRow: { flexDirection: 'row', alignItems: 'center' },
  stateIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stateLabel: { ...typography.secondaryInfo, color: colors.textSecondary },
  stateValue: { ...typography.cardTitle, color: colors.textPrimary, marginTop: spacing.xs / 2 },
  stateSince: { ...typography.secondaryInfo, color: colors.textSecondary, marginTop: spacing.xs / 2 },
  chartTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.md },
  noDataText: { ...typography.body, color: colors.textSecondary },
});
