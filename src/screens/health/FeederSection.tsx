import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlertCard } from '../../components/AlertCard';
import { BarChart } from '../../components/BarChart';
import { DeviceCard } from '../../components/DeviceCard';
import { QueryState } from '../../components/QueryState';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { useLeiturasComedouro } from '../../hooks/queries/useLeiturasComedouro';
import {
  feederHistoryBars,
  filterByRange,
  reservoirColor,
  sumConsumption,
  ultimasRefeicoes,
  type LeituraRange,
} from '../../utils/leituraMappers';

type FeederSectionProps = {
  petId: number;
};

const RANGE_SEGMENTS: { key: LeituraRange; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: '30dias', label: '30 dias' },
];

export function FeederSection({ petId }: FeederSectionProps) {
  const [range, setRange] = useState<LeituraRange>('hoje');
  const leiturasQuery = useLeiturasComedouro(petId);

  return (
    <QueryState
      isLoading={leiturasQuery.isLoading}
      isError={leiturasQuery.isError}
      error={leiturasQuery.error}
      data={leiturasQuery.data}
      isEmpty={(leituras) => leituras.length === 0}
      onRetry={leiturasQuery.refetch}
      emptyTitle="Nenhuma leitura registrada"
      emptyDescription="Assim que o comedouro enviar dados, eles aparecem aqui."
    >
      {(leituras) => {
        const atual = leituras[0];
        const historico = filterByRange(leituras, range);
        const reservoirLow = atual.nivelRacaoPct < 20;
        const reservoirTone = reservoirColor(atual.nivelRacaoPct);
        const consumedGrams = Math.round(sumConsumption(historico));
        const meals = ultimasRefeicoes(historico, range);
        const consumptionChart = feederHistoryBars(historico, range);

        return (
          <>
            <DeviceCard icon="bowl-mix-outline" title="Comedouro Inteligente" connected />

            <StatusCard>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>Nível do reservatório</Text>
                <Text style={[styles.reservoirValue, { color: reservoirTone }]}>{atual.nivelRacaoPct}%</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${atual.nivelRacaoPct}%`, backgroundColor: reservoirTone }]} />
              </View>
            </StatusCard>

            <SegmentedControl segments={RANGE_SEGMENTS} value={range} onChange={setRange} />

            <StatusCard>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>Consumo no período</Text>
                <View style={styles.chartStats}>
                  <Text style={styles.chartValue}>{consumedGrams}g</Text>
                  <Text style={styles.chartUnit}>{range === 'hoje' ? 'hoje' : range === '7dias' ? '7 dias' : '30 dias'}</Text>
                </View>
              </View>
              {consumptionChart.data.length > 0 ? (
                <BarChart
                  data={consumptionChart.data}
                  labels={consumptionChart.labels}
                  barColors={consumptionChart.barColors}
                  legend={[
                    { label: 'Menor consumo', color: colors.danger },
                    { label: 'Médio', color: colors.warning },
                    { label: 'Maior consumo', color: colors.success },
                  ]}
                />
              ) : null}
              {consumptionChart.data.length === 0 ? <Text style={styles.trendText}>Sem leituras no período selecionado.</Text> : null}
            </StatusCard>

            <StatusCard>
              <Text style={styles.chartTitle}>Últimas refeições</Text>
              <View style={{ marginTop: spacing.md }}>
                {meals.map((meal, index) => (
                  <View key={`${meal.time}-${index}`} style={styles.mealRow}>
                    <View style={styles.mealIcon}>
                      <MaterialCommunityIcons name="silverware-fork-knife" size={16} color={colors.bluePrimary} />
                    </View>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealGrams}>{meal.grams}g</Text>
                  </View>
                ))}
              </View>
            </StatusCard>

            {reservoirLow && (
              <AlertCard
                title="Reposição recomendada"
                message="O nível de ração está abaixo do ideal. O tutor deve verificar o reservatório."
                severity="medium"
              />
            )}
          </>
        );
      }}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  chartTitle: { ...typography.cardTitle, color: colors.textPrimary },
  reservoirValue: { ...typography.cardTitle, color: colors.success },
  track: { height: 10, borderRadius: radius.pill, backgroundColor: colors.backgroundGray },
  fill: { height: 10, borderRadius: radius.pill },
  chartStats: { alignItems: 'flex-end' },
  chartValue: { ...typography.pageTitle, fontSize: 22, color: colors.textPrimary },
  chartUnit: { ...typography.caption, color: colors.textSecondary },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs / 2, marginTop: spacing.sm },
  trendText: { ...typography.secondaryInfo, color: colors.textSecondary, fontWeight: '600' },
  mealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm + 2 },
  mealIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  mealTime: { ...typography.body, color: colors.textPrimary, flex: 1 },
  mealGrams: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
});
