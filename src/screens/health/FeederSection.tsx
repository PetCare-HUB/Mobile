import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { AlertCard } from '../../components/AlertCard';
import { SensorCard } from '../../components/SensorCard';
import { feederMetrics } from '../../data/mockData';
import { getSensorData, saveSensorData } from '../../storage/sensorStorage';
import type { SensorMetric } from '../../types/pet';

export function FeederSection() {
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
      {nivelBaixo && (
        <AlertCard
          title="Reposição recomendada"
          message="O nível de ração está abaixo do ideal. O tutor deve verificar o reservatório."
          severity="medium"
        />
      )}
    </>
  );
}
