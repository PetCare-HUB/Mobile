import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { AlertCard } from '../components/AlertCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
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
    <ScreenContainer>
      <SectionHeader
        title="Comedouro Inteligente"
        subtitle="O comedouro monitora nível de ração, consumo diário e horários de refeição."
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
      {nivelBaixo && (
        <AlertCard
          title="Reposição recomendada"
          message="O nível de ração está abaixo do ideal. O tutor deve verificar o reservatório."
          severity="medium"
        />
      )}
    </ScreenContainer>
  );
}
