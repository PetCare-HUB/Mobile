import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ScreenContainer } from '../components/ScreenContainer';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';

const EQUIPE = [
  { nome: 'Alexander Dennis Isidro Mamani', rm: '565554' },
  { nome: 'Kelson Zhang', rm: '563748' },
];

type Build = {
  commitHash: string;
  commitSujo: boolean;
  geradoEm: string;
};

/**
 * Os valores vem do app.config.js, resolvidos no momento do build. Se algum
 * faltar e porque o build nao passou por lá -- melhor dizer isso do que exibir
 * um hash inventado, ja que o avaliador usa esta tela justamente para conferir
 * qual commit gerou o APK.
 */
function lerBuild(): Build {
  const extra = Constants.expoConfig?.extra ?? {};

  return {
    commitHash: typeof extra.commitHash === 'string' ? extra.commitHash : 'indisponivel',
    commitSujo: extra.commitSujo === true,
    geradoEm: typeof extra.geradoEm === 'string' ? extra.geradoEm : '',
  };
}

function formatarData(iso: string): string {
  if (!iso) return 'indisponível';

  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return 'indisponível';

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Entrada escalonada: cada bloco sobe e aparece um pouco depois do anterior. */
function Entrada({ atraso, children }: { atraso: number; children: ReactNode }) {
  const progresso = useSharedValue(0);
  const semMovimento = useReducedMotion();

  useEffect(() => {
    if (semMovimento) {
      progresso.value = 1;
      return;
    }

    progresso.value = withDelay(
      atraso,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
  }, [atraso, semMovimento]);

  const estilo = useAnimatedStyle(() => ({
    opacity: progresso.value,
    transform: [{ translateY: (1 - progresso.value) * 16 }],
  }));

  return <Animated.View style={estilo}>{children}</Animated.View>;
}

/**
 * Pulso continuo atras do icone. E um app de saude de pet: a batida lenta
 * remete a sinal vital, e nao a um spinner de carregamento.
 */
function Pulso() {
  const onda = useSharedValue(0);
  const semMovimento = useReducedMotion();

  useEffect(() => {
    if (semMovimento) return;

    onda.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
  }, [semMovimento]);

  const anel = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - onda.value),
    transform: [{ scale: 1 + onda.value * 0.9 }],
  }));

  const respiro = useAnimatedStyle(() => ({
    // Sobe e volta dentro do mesmo ciclo da onda, sem segundo temporizador.
    transform: [{ scale: 1 + Math.sin(onda.value * Math.PI) * 0.05 }],
  }));

  return (
    <View style={styles.pulsoArea}>
      <Animated.View style={[styles.anel, anel]} />
      <Animated.View style={[styles.iconeBadge, respiro]}>
        <MaterialCommunityIcons name="paw" size={34} color={colors.greenPrimary} />
      </Animated.View>
    </View>
  );
}

export function AboutScreen() {
  const build = lerBuild();
  const versao = Constants.expoConfig?.version ?? '—';

  return (
    <ScreenContainer>
      <Entrada atraso={0}>
        <View style={styles.cabecalho}>
          <Pulso />
          <Text style={styles.nome}>PetCare Hub</Text>
          <Text style={styles.subtitulo}>App do tutor · versão {versao}</Text>
        </View>
      </Entrada>

      <Entrada atraso={120}>
        <StatusCard>
          <Text style={styles.secaoTitulo}>Versão publicada</Text>

          <View style={styles.linha}>
            <Text style={styles.rotulo}>Commit</Text>
            <Text style={styles.hash}>{build.commitHash}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.rotulo}>Gerado em</Text>
            <Text style={styles.valor}>{formatarData(build.geradoEm)}</Text>
          </View>

          {build.commitSujo ? (
            <View style={styles.aviso}>
              <MaterialCommunityIcons name="alert-outline" size={16} color={colors.warning} />
              <Text style={styles.avisoTexto}>
                Este build saiu de uma cópia com alterações não commitadas, então o código
                não corresponde exatamente ao commit acima.
              </Text>
            </View>
          ) : null}
        </StatusCard>
      </Entrada>

      <Entrada atraso={240}>
        <StatusCard>
          <Text style={styles.secaoTitulo}>Equipe · 2TDSPG</Text>
          {EQUIPE.map((integrante) => (
            <View key={integrante.rm} style={styles.linha}>
              <Text style={styles.valor}>{integrante.nome}</Text>
              <Text style={styles.rotulo}>RM {integrante.rm}</Text>
            </View>
          ))}
        </StatusCard>
      </Entrada>

      <Entrada atraso={360}>
        <Text style={styles.rodape}>
          Challenge FIAP 2026 · parceria CLYVO VET{'\n'}
          Os dados exibidos no app vêm da API do PetCare Hub.
        </Text>
      </Entrada>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cabecalho: { alignItems: 'center', marginBottom: spacing.lg },
  pulsoArea: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  anel: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.greenPrimary,
  },
  iconeBadge: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { ...typography.body, fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitulo: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  secaoTitulo: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  rotulo: { ...typography.caption, color: colors.textSecondary },
  valor: { flex: 1, ...typography.body, color: colors.textPrimary },
  hash: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  avisoTexto: { flex: 1, ...typography.caption, color: colors.textSecondary },
  rodape: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
