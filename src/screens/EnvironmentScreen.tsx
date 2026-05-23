import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { SensorCard } from '../components/SensorCard';
import { environmentMetrics } from '../data/mockData';
import { getSensorData, saveSensorData } from '../storage/sensorStorage';
import type { SensorMetric } from '../types/pet';

export function EnvironmentScreen() {
  const [metrics, setMetrics] = useState<SensorMetric[]>(environmentMetrics);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const saved = await getSensorData('ambiente');
        if (saved && saved.length > 0) {
          setMetrics(saved);
        } else {
          setMetrics(environmentMetrics);
          await saveSensorData('ambiente', environmentMetrics);
        }
      }
      carregar();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ambiente</Text>
      <Text style={styles.subtitle}>
        Sensores identificam riscos de temperatura, umidade, qualidade do ar
        e presença no cômodo.
      </Text>
      {metrics.map((metric) => (
        <SensorCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          status={metric.status}
        />
      ))}
      <Text style={styles.footerNote}>
        * Último estado conhecido restaurado do AsyncStorage
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 20 },
  footerNote: { fontSize: 12, color: '#94A3B8', marginTop: 12, textAlign: 'center' },
});