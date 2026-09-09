import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SensorCard } from '../../components/SensorCard';
import { environmentMetrics } from '../../data/mockData';
import { getSensorData, saveSensorData } from '../../storage/sensorStorage';
import type { SensorMetric } from '../../types/pet';

export function EnvironmentSection() {
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
    <>
      {metrics.map((metric) => (
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
