import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlertCard } from '../components/AlertCard';
import { HealthScore } from '../components/HealthScore';
import { PetAvatar } from '../components/PetAvatar';
import { PreventiveItem } from '../components/PreventiveItem';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';
import { homeAlerts, petSummary } from '../data/mockData';
import { getPetProfile, type PetProfile } from '../storage/petStorage';
import { getPreventiveItems } from '../storage/preventiveStorage';
import type { PreventiveItemType } from '../types/pet';

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
  const petClinic = petProfile?.clinica || 'Clínica não vinculada';
  const pendentes = preventivos.filter((i) => !i.done).length;

  return (
    <ScreenContainer>
      <Text style={styles.subtitle}>
        Monitoramento contínuo para transformar cuidado reativo em cuidado preventivo.
      </Text>

      <HealthScore petName={petName} score={petSummary.score} status={petSummary.status} />

      <StatusCard>
        <View style={styles.petInfoHeader}>
          <PetAvatar name={petName} />
          <View style={styles.petInfoHeaderText}>
            <Text style={styles.petInfoTitle}>{petName}</Text>
            <Text style={styles.petInfoSubtitle}>{petSpecies} • {petBreed}</Text>
          </View>
        </View>
        <Text style={styles.petInfoText}>
          Clínica: <Text style={styles.petInfoStrong}>{petClinic}</Text>
        </Text>
      </StatusCard>

      <TouchableOpacity
        style={styles.preventivoButton}
        onPress={() => router.push('/preventivo')}
        activeOpacity={0.8}
      >
        <View style={styles.preventivoButtonContent}>
          <MaterialCommunityIcons name="calendar-check" size={20} color={colors.greenPrimary} />
          <Text style={styles.preventivoButtonText}>Calendário Preventivo</Text>
          {pendentes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pendentes} pendente{pendentes > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <SectionHeader title="Alertas ativos" />
      {homeAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          title={alert.title}
          message={alert.message}
          severity={alert.severity}
        />
      ))}

      <SectionHeader title="Próximas ações" />
      {preventivos.slice(0, 2).map((item) => (
        <PreventiveItem
          key={item.id}
          title={item.title}
          date={item.date}
          description={item.description}
          done={item.done}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  petInfoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  petInfoHeaderText: { marginLeft: spacing.md },
  petInfoTitle: { ...typography.cardTitle, color: colors.textPrimary },
  petInfoSubtitle: { ...typography.body, color: colors.textSecondary },
  petInfoText: { ...typography.body, color: colors.textSecondary },
  petInfoStrong: { fontWeight: '600', color: colors.textPrimary },
  preventivoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: spacing.cardPadding,
    borderRadius: radius.cardSm,
    marginBottom: spacing.xl,
  },
  preventivoButtonContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  preventivoButtonText: { ...typography.subtitle, color: colors.textPrimary },
  badge: {
    backgroundColor: colors.greenLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { ...typography.caption, color: colors.greenPrimary, fontWeight: '600' },
});
