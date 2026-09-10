import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DeviceCard } from '../../components/DeviceCard';
import { QueryState } from '../../components/QueryState';
import { SensorCard } from '../../components/SensorCard';
import { StatusCard } from '../../components/StatusCard';
import { colors, radius, spacing, typography } from '../../theme';
import { useLeiturasAmbiente } from '../../hooks/queries/useLeiturasAmbiente';
import { comfortLabel, isComfortable, statusQualidadeAr, statusUmidade, temperatureColor } from '../../utils/leituraMappers';

type EnvironmentSectionProps = {
  petId: number;
};

export function EnvironmentSection({ petId }: EnvironmentSectionProps) {
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
});
