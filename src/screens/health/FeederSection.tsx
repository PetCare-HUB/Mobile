import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlertCard } from '../../components/AlertCard';
import { BarChart } from '../../components/BarChart';
import { DeviceCard } from '../../components/DeviceCard';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { feederConsumption } from '../../data/mockData';

export function FeederSection() {
  const reservoirLow = feederConsumption.reservoirPercent < 40;

  return (
    <>
      <DeviceCard icon="bowl-mix-outline" title="Comedouro Inteligente" connected={feederConsumption.connected} />

      <StatusCard>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.chartTitle}>Nível do reservatório</Text>
          <Text style={[styles.reservoirValue, reservoirLow && { color: colors.warning }]}>
            {feederConsumption.reservoirPercent}%
          </Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${feederConsumption.reservoirPercent}%`, backgroundColor: reservoirLow ? colors.warning : colors.success },
            ]}
          />
        </View>
      </StatusCard>

      <StatusCard>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.chartTitle}>Consumo de hoje</Text>
          <View style={styles.chartStats}>
            <Text style={styles.chartValue}>{feederConsumption.todayGrams}g</Text>
            <Text style={styles.chartUnit}>hoje</Text>
          </View>
        </View>
        <BarChart
          data={feederConsumption.meals.map((meal) => meal.grams)}
          labels={feederConsumption.meals.map((meal) => meal.time)}
          color={colors.bluePrimary}
        />
        <View style={styles.trendRow}>
          <MaterialCommunityIcons
            name={feederConsumption.changePercent < 0 ? 'arrow-down-bold' : 'arrow-up-bold'}
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.trendText}>
            {Math.abs(feederConsumption.changePercent)}% vs. média de {feederConsumption.averageGrams}g
          </Text>
        </View>
      </StatusCard>

      <StatusCard>
        <Text style={styles.chartTitle}>Últimas refeições</Text>
        <View style={{ marginTop: spacing.md }}>
          {feederConsumption.meals.map((meal) => (
            <View key={meal.time} style={styles.mealRow}>
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
