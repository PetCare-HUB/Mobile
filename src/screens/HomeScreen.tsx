import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HealthScore } from '../components/HealthScore';
import { PetAvatar } from '../components/PetAvatar';
import { colors, radius, spacing, typography } from '../theme';
import { collarMetrics, environmentMetrics, feederMetrics, homeAlerts, petSummary } from '../data/mockData';
import { getPetProfile, type PetProfile } from '../storage/petStorage';
import { getPreventiveItems } from '../storage/preventiveStorage';
import type { HealthStatus, PreventiveItemType, SensorMetric } from '../types/pet';

const STATUS_PRIORITY: Record<HealthStatus, number> = { risk: 2, attention: 1, healthy: 0 };

function worstStatus(metrics: SensorMetric[]): HealthStatus {
  return metrics.reduce<HealthStatus>((worst, metric) => {
    const status = metric.status ?? 'healthy';
    return STATUS_PRIORITY[status] > STATUS_PRIORITY[worst] ? status : worst;
  }, 'healthy');
}

type SummaryTile = {
  key: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  iconColor: string;
  backgroundColor: string;
};

export function HomeScreen() {
  const router = useRouter();
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [preventivos, setPreventivos] = useState<PreventiveItemType[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function carregar() {
        const [perfil, itens] = await Promise.all([
          getPetProfile(),
          getPreventiveItems(),
        ]);
        if (isActive) {
          setPetProfile(perfil);
          setPreventivos(itens);
        }
      }

      carregar();
      return () => { isActive = false; };
    }, [])
  );

  const petName = petProfile?.nome || petSummary.nome;
  const petSpecies = petProfile?.especie || petSummary.especie;
  const petBreed = petProfile?.raca || petSummary.raca;

  const activityStatus = collarMetrics[0]?.status ?? 'healthy';
  const feederStatus = feederMetrics[0]?.status ?? 'healthy';
  const environmentStatus = worstStatus(environmentMetrics);
  const alertsCount = homeAlerts.length;

  const summaryTiles: SummaryTile[] = [
    {
      key: 'atividade',
      icon: 'run',
      label: 'Atividade',
      value: activityStatus === 'healthy' ? 'Boa hoje' : activityStatus === 'attention' ? 'Atenção' : 'Cuidado',
      iconColor: colors.greenPrimary,
      backgroundColor: colors.greenLight,
    },
    {
      key: 'alimentacao',
      icon: 'bowl-outline',
      label: 'Alimentação',
      value: feederStatus === 'healthy' ? 'Normal' : feederStatus === 'attention' ? 'Baixo' : 'Crítico',
      iconColor: colors.bluePrimary,
      backgroundColor: colors.blueLight,
    },
    {
      key: 'ambiente',
      icon: 'home-outline',
      label: 'Ambiente',
      value: environmentStatus === 'healthy' ? 'Confortável' : environmentStatus === 'attention' ? 'Atenção' : 'Risco',
      iconColor: colors.aiPurple,
      backgroundColor: '#EDEBFB',
    },
    {
      key: 'alertas',
      icon: 'alert-circle-outline',
      label: 'Alertas',
      value: alertsCount > 0 ? `${alertsCount} ativo${alertsCount > 1 ? 's' : ''}` : 'Nenhum',
      iconColor: colors.danger,
      backgroundColor: '#FBE7E7',
    },
  ];

  function handleTilePress(key: SummaryTile['key']) {
    if (key === 'alertas') {
      router.push('/alertas');
      return;
    }
    const saudeTab = key === 'atividade' ? 'coleira' : key;
    router.push({ pathname: '/saude', params: { tab: saudeTab } });
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="paw" size={22} color={colors.greenPrimary} />
          <Text style={styles.logo}>PetCare Hub</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/alertas')} hitSlop={8}>
          <View>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textPrimary} />
            {alertsCount > 0 ? <View style={styles.bellBadge} /> : null}
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.petRow}>
          <PetAvatar name={petName} size={48} />
          <View style={styles.petRowText}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{petName}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.petSubtitle}>{petSpecies} • {petBreed}</Text>
          </View>
        </View>

        <HealthScore
          petName={petName}
          score={petSummary.score}
          status={petSummary.status}
          onPress={() => router.push('/saude')}
        />

        <View style={styles.grid}>
          {summaryTiles.map((tile) => (
            <TouchableOpacity
              key={tile.key}
              style={styles.gridTile}
              onPress={() => handleTilePress(tile.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIcon, { backgroundColor: tile.backgroundColor }]}>
                <MaterialCommunityIcons name={tile.icon} size={20} color={tile.iconColor} />
              </View>
              <Text style={styles.gridLabel}>{tile.label}</Text>
              <Text style={[styles.gridValue, { color: tile.iconColor }]}>{tile.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Próximas ações</Text>
          <TouchableOpacity onPress={() => router.push('/preventivo')}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {preventivos.slice(0, 2).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.actionRow}
            onPress={() => router.push('/preventivo')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name={item.done ? 'check-circle-outline' : 'calendar-check-outline'} size={20} color={colors.bluePrimary} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <View style={styles.actionMetaRow}>
                <Text style={styles.actionDate}>{item.date}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { ...typography.cardTitle, color: colors.textPrimary },
  bellBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  petRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  petRowText: { marginLeft: spacing.md },
  petNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  petName: { ...typography.cardTitle, color: colors.textPrimary },
  petSubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs / 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 2,
    marginBottom: spacing.xl,
  },
  gridTile: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.cardSm,
    padding: spacing.md,
  },
  gridIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gridLabel: { ...typography.body, color: colors.textPrimary },
  gridValue: { ...typography.secondaryInfo, fontWeight: '600', marginTop: spacing.xs / 2 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.cardTitle, color: colors.textPrimary },
  sectionLink: { ...typography.secondaryInfo, color: colors.greenPrimary, fontWeight: '600' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.cardSm,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionText: { flex: 1 },
  actionTitle: { ...typography.subtitle, color: colors.textPrimary },
  actionMetaRow: { flexDirection: 'row', marginTop: spacing.xs / 2 },
  actionDate: { ...typography.secondaryInfo, color: colors.bluePrimary, fontWeight: '600' },
});
