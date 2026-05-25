import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { SensorCard } from '../components/SensorCard';
import { collarMetrics } from '../data/mockData';
import { getSensorData, saveSensorData } from '../storage/sensorStorage';
import type { SensorMetric } from '../types/pet';

export function CollarScreen() {
  const [metrics, setMetrics] = useState<SensorMetric[]>(collarMetrics);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const saved = await getSensorData('coleira');
        if (saved && saved.length > 0) {
          setMetrics(saved);
        } else {
          setMetrics(collarMetrics);
          await saveSensorData('coleira', collarMetrics);
        }
      }
      carregar();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Coleira Smart</Text>
      <Text style={styles.subtitle}>
        A coleira acompanha atividade física e bateria para apoiar a detecção de
        mudanças no comportamento do pet.
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