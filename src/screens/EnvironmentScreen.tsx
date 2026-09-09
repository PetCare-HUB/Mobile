import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
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
    <ScreenContainer>
      <SectionHeader
        title="Ambiente"
        subtitle="Sensores identificam riscos de temperatura, umidade, qualidade do ar e presença no cômodo."
        level="page"
      />
      {metrics.map((metric) => (
        <SensorCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          status={metric.status}
        />
      ))}
    </ScreenContainer>
  );
}
