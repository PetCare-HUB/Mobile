import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DeviceCard } from '../../components/DeviceCard';
import { BarChart } from '../../components/BarChart';
import { QueryState } from '../../components/QueryState';
import { SegmentedControl } from '../../components/SegmentedControl';
import { SensorCard } from '../../components/SensorCard';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { useLeiturasAmbiente } from '../../hooks/queries/useLeiturasAmbiente';
import {
  comfortLabel,
  filterByRange,
  isComfortable,
  statusQualidadeAr,
  statusUmidade,
  temperatureColor,
  temperatureHistoryBars,
  type LeituraRange,
} from '../../utils/leituraMappers';

type EnvironmentSectionProps = {
  petId: number;
};

const RANGE_SEGMENTS: { key: LeituraRange; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: '30dias', label: '30 dias' },
];

export function EnvironmentSection({ petId }: EnvironmentSectionProps) {
  const [range, setRange] = useState<LeituraRange>('hoje');
  const leiturasQuery = useLeiturasAmbiente(petId);

  return (
    <QueryState
      isLoading={leiturasQuery.isLoading}
      isError={leiturasQuery.isError}
      error={leiturasQuery.error}
      data={leiturasQuery.data}
      isEmpty={(leituras) => leituras.length === 0}
      onRetry={leiturasQuery.refetch}
      emptyTitle="Nenhuma leitura registrada"
      emptyDescription="Assim que o sensor de ambiente enviar dados, eles aparecem aqui."
    >
      {(leituras) => {
        const atual = leituras[0];
        const historico = filterByRange(leituras, range);
        const temperatureChart = temperatureHistoryBars(historico, range);
        const confortavel = isComfortable(atual);

        return (
          <>
            <DeviceCard icon="home-thermometer-outline" title="Sensor de Ambiente" connected />

            <StatusCard style={styles.comfortCard}>
              <View style={[styles.comfortIcon, !confortavel && { backgroundColor: colors.blueLight }]}>
                <MaterialCommunityIcons
                  name={confortavel ? 'emoticon-happy-outline' : 'alert-outline'}
                  size={22}
                  color={confortavel ? colors.greenPrimary : colors.warning}
                />
              </View>
              <Text style={styles.comfortLabel}>Ambiente {comfortLabel(atual).toLowerCase()}</Text>
            </StatusCard>

            <SensorCard
              title="Temperatura ambiente"
              value={`${atual.temperaturaAmbiente}°C`}
              description="Faixa segura: 10°C a 32°C."
              color={temperatureColor(atual.temperaturaAmbiente)}
            />
            <SegmentedControl segments={RANGE_SEGMENTS} value={range} onChange={setRange} />
            <StatusCard>
              <Text style={styles.historyTitle}>Histórico de temperatura</Text>
              {temperatureChart.data.length > 0 ? (
                <BarChart
                  data={temperatureChart.data}
                  labels={temperatureChart.labels}
                  barColors={temperatureChart.barColors}
                  legend={[
                    { label: 'Fora da faixa', color: colors.danger },
                    { label: 'No limite', color: colors.warning },
                    { label: 'Confortável', color: colors.success },
                  ]}
                />
              ) : (
                <Text style={styles.historyEmpty}>Sem leituras no período selecionado.</Text>
              )}
            </StatusCard>
            <SensorCard
              title="Umidade"
              value={`${atual.umidadePct}%`}
              description="Faixa ideal: 30% a 75%."
              status={statusUmidade(atual.umidadePct)}
            />
            <SensorCard
              title="Qualidade do ar"
              value={atual.qualidadeArPpm <= 1000 ? 'Boa' : `${atual.qualidadeArPpm} ppm`}
              description="Sensor MQ-135 — alerta acima de 1000 ppm."
              status={statusQualidadeAr(atual.qualidadeArPpm)}
            />
            <SensorCard
              title="Presença no cômodo"
              value={atual.petPresente ? 'Detectado' : 'Não detectado'}
              description="Sensor PIR identifica presença do pet no ambiente."
            />
          </>
        );
      }}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  comfortCard: { flexDirection: 'row', alignItems: 'center' },
  comfortIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  comfortLabel: { ...typography.cardTitle, color: colors.textPrimary },
  historyTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.md },
  historyEmpty: { ...typography.body, color: colors.textSecondary },
});
