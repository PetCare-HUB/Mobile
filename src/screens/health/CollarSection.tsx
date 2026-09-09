import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BarChart } from '../../components/BarChart';
import { BreakdownRow } from '../../components/BreakdownRow';
import { DeviceCard } from '../../components/DeviceCard';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { collarActivity } from '../../data/mockData';

type Range = 'hoje' | '7dias' | '30dias';

const RANGE_SEGMENTS: { key: Range; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: '30dias', label: '30 dias' },
];

export function CollarSection() {
  const [range, setRange] = useState<Range>('hoje');

  return (
    <>
      <DeviceCard
        icon="watch-variant"
        title="Coleira Smart"
        connected={collarActivity.connected}
        rightIcon="battery-high"
        rightValue={`${collarActivity.battery}%`}
      />

      <StatusCard style={styles.stateCard}>
        <View style={styles.stateRow}>
          <View style={styles.stateIcon}>
            <MaterialCommunityIcons name="run" size={22} color={colors.greenPrimary} />
          </View>
          <View>
            <Text style={styles.stateLabel}>Estado atual</Text>
            <Text style={styles.stateValue}>{collarActivity.state}</Text>
            <Text style={styles.stateSince}>Desde {collarActivity.stateSince}</Text>
          </View>
        </View>
      </StatusCard>

      <SegmentedControl segments={RANGE_SEGMENTS} value={range} onChange={setRange} />

      <StatusCard>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.chartTitle}>Nível de atividade</Text>
          <View style={styles.chartStats}>
            <Text style={styles.chartValue}>{collarActivity.steps.toLocaleString('pt-BR')}</Text>
            <Text style={styles.chartUnit}>passos</Text>
          </View>
        </View>
        <BarChart data={collarActivity.hourlyActivity} labels={collarActivity.hourlyLabels} color={colors.bluePrimary} />
        <View style={styles.trendRow}>
          <MaterialCommunityIcons name="arrow-up-bold" size={14} color={colors.success} />
          <Text style={styles.trendText}>{collarActivity.stepsChangePercent}% vs. ontem</Text>
        </View>
      </StatusCard>

      <StatusCard>
        <Text style={styles.chartTitle}>Tempo em cada estado</Text>
        <View style={{ marginTop: spacing.md }}>
          {collarActivity.timeInState.map((item, index) => (
            <BreakdownRow
              key={item.key}
              color={[colors.bluePrimary, colors.warning, colors.greenSecondary][index]}
              label={item.label}
              valueLabel={item.hours}
              percent={item.percent}
            />
          ))}
        </View>
      </StatusCard>
    </>
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
  chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  chartTitle: { ...typography.cardTitle, color: colors.textPrimary },
  chartStats: { alignItems: 'flex-end' },
  chartValue: { ...typography.pageTitle, fontSize: 22, color: colors.textPrimary },
  chartUnit: { ...typography.caption, color: colors.textSecondary },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs / 2, marginTop: spacing.sm },
  trendText: { ...typography.secondaryInfo, color: colors.success, fontWeight: '600' },
});
