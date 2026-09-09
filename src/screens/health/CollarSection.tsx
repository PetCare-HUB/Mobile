import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SensorCard } from '../../components/SensorCard';
import { collarMetrics } from '../../data/mockData';
import { getSensorData, saveSensorData } from '../../storage/sensorStorage';
import type { SensorMetric } from '../../types/pet';

export function CollarSection() {
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
