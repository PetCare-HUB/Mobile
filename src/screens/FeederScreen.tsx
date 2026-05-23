import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AlertCard } from '../components/AlertCard';
import { SensorCard } from '../components/SensorCard';
import { feederMetrics } from '../data/mockData';
import { getSensorData, saveSensorData } from '../storage/sensorStorage';
import type { SensorMetric } from '../types/pet';

export function FeederScreen() {
  const [metrics, setMetrics] = useState<SensorMetric[]>(feederMetrics);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const saved = await getSensorData('comedouro');
        if (saved && saved.length > 0) {
          setMetrics(saved);
        } else {
          setMetrics(feederMetrics);
          await saveSensorData('comedouro', feederMetrics);
        }
      }
      carregar();
    }, [])
  );

  const nivelBaixo = metrics.find((m) => m.id === 1)?.status === 'attention';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Comedouro Inteligente</Text>
      <Text style={styles.subtitle}>
        O comedouro monitora nível de ração, consumo diário e horários de refeição.
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
      {nivelBaixo && (
        <AlertCard
          title="Reposição recomendada"
          message="O nível de ração está abaixo do ideal. O tutor deve verificar o reservatório."
          severity="medium"
        />
      )}
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