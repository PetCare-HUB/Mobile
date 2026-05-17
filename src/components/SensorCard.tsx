import { StyleSheet, Text, View } from 'react-native';

import type { HealthStatus } from '../types/pet';

type SensorCardProps = {
  title: string;
  value: string;
  description: string;
  status?: HealthStatus;
};

function getStatusColor(status?: HealthStatus) {
  if (status === 'healthy') return '#16A34A';
  if (status === 'attention') return '#CA8A04';
  if (status === 'risk') return '#DC2626';
  return '#2563EB';
}

export function SensorCard({
  title,
  value,
  description,
  status,
}: SensorCardProps) {
  const color = getStatusColor(status);

  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: color }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  indicator: {
    width: 6,
    borderRadius: 99,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});