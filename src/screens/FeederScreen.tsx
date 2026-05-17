import { ScrollView, StyleSheet, Text } from 'react-native';

import { AlertCard } from '../components/AlertCard';
import { SensorCard } from '../components/SensorCard';
import { feederMetrics } from '../data/mockData';

export function FeederScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Comedouro Inteligente</Text>

      <Text style={styles.subtitle}>
        O comedouro monitora nível de ração, consumo diário e horários de
        refeição.
      </Text>

      {feederMetrics.map((metric) => (
        <SensorCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          status={metric.status}
        />
      ))}

      <AlertCard
        title="Reposição recomendada"
        message="O nível de ração está abaixo do ideal. O tutor deve verificar o reservatório."
        severity="medium"
      />
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