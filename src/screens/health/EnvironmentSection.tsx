import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DeviceCard } from '../../components/DeviceCard';
import { SensorCard } from '../../components/SensorCard';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { environmentMetrics, environmentSummary } from '../../data/mockData';

export function EnvironmentSection() {
  return (
    <>
      <DeviceCard icon="home-thermometer-outline" title="Sensor de Ambiente" connected={environmentSummary.connected} />

      <StatusCard style={styles.comfortCard}>
        <View style={styles.comfortIcon}>
          <MaterialCommunityIcons name="emoticon-happy-outline" size={22} color={colors.greenPrimary} />
        </View>
        <Text style={styles.comfortLabel}>Ambiente {environmentSummary.comfortLabel.toLowerCase()}</Text>
      </StatusCard>

      {environmentMetrics.map((metric) => (
        <SensorCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          status={metric.status}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  comfortCard: { flexDirection: 'row', alignItems: 'center' },
  comfortIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  comfortLabel: { ...typography.cardTitle, color: colors.textPrimary },
});
