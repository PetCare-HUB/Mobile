import { ScrollView, StyleSheet, Text } from 'react-native';

import { SensorCard } from '../components/SensorCard';
import { collarMetrics } from '../data/mockData';

export function CollarScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Coleira Smart</Text>

      <Text style={styles.subtitle}>
        A coleira acompanha atividade física e bateria para apoiar a detecção de
        mudanças no comportamento do pet.
      </Text>

      {collarMetrics.map((metric) => (
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
});