import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { HealthStatus } from '../types/pet';

type ScoreCardProps = {
  petName: string;
  score: number;
  status: HealthStatus;
};

function getStatusLabel(status: HealthStatus) {
  if (status === 'healthy') return 'Saudável';
  if (status === 'attention') return 'Atenção';
  return 'Risco';
}

function getScoreColor(status: HealthStatus) {
  if (status === 'healthy') return '#16A34A';
  if (status === 'attention') return '#CA8A04';
  return '#DC2626';
}

export function ScoreCard({ petName, score, status }: ScoreCardProps) {
  const scoreColor = getScoreColor(status);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Score de Saúde</Text>
      <Text style={styles.petName}>{petName}</Text>

      <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
      </View>

      <View style={styles.statusContainer}>
        <MaterialCommunityIcons name="circle" size={14} color={scoreColor} />
        <Text style={[styles.status, { color: scoreColor }]}>
          {getStatusLabel(status)}
        </Text>
      </View>

      <Text style={styles.description}>
        O score resume sinais de atividade, alimentação, ambiente e histórico
        preventivo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
});
