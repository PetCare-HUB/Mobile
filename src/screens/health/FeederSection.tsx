import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlertCard } from '../../components/AlertCard';
import { BarChart } from '../../components/BarChart';
import { DeviceCard } from '../../components/DeviceCard';
import { QueryState } from '../../components/QueryState';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { useLeiturasComedouro } from '../../hooks/queries/useLeiturasComedouro';
import { mediaConsumoDiario, reservoirColor, sumConsumoHoje, ultimasRefeicoes } from '../../utils/leituraMappers';

type FeederSectionProps = {
  petId: number;
};

export function FeederSection({ petId }: FeederSectionProps) {
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
        const reservoirLow = atual.nivelRacaoPct < 20;
        const reservoirTone = reservoirColor(atual.nivelRacaoPct);
        const todayGrams = Math.round(sumConsumoHoje(leituras));
        const averageGrams = mediaConsumoDiario(leituras);
        const changePercent = averageGrams > 0 ? Math.round(((todayGrams - averageGrams) / averageGrams) * 100) : 0;
        const meals = ultimasRefeicoes(leituras);

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

            <StatusCard>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>Consumo de hoje</Text>
                <View style={styles.chartStats}>
                  <Text style={styles.chartValue}>{todayGrams}g</Text>
                  <Text style={styles.chartUnit}>hoje</Text>
                </View>
              </View>
              {meals.length > 0 ? (
                <BarChart data={meals.map((m) => m.grams)} labels={meals.map((m) => m.time)} color={colors.bluePrimary} />
              ) : null}
              {averageGrams > 0 ? (
                <View style={styles.trendRow}>
                  <MaterialCommunityIcons
                    name={changePercent < 0 ? 'arrow-down-bold' : 'arrow-up-bold'}
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.trendText}>
                    {Math.abs(changePercent)}% vs. média de {averageGrams}g
                  </Text>
                </View>
              ) : null}
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
