import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlertCard } from '../components/AlertCard';
import { PreventiveItem } from '../components/PreventiveItem';
import { ScoreCard } from '../components/ScoreCard';
import { homeAlerts, petSummary } from '../data/mockData';
import { getPetProfile, type PetProfile } from '../storage/petStorage';
import { getPreventiveItems } from '../storage/preventiveStorage';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { PreventiveItemType } from '../types/pet';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Monitoramento contínuo para transformar cuidado reativo em cuidado preventivo.
      </Text>

      <ScoreCard
        petName={petName}
        score={petSummary.score}
        status={petSummary.status}
      />

      <View style={styles.petInfoCard}>
        <Text style={styles.petInfoTitle}>Pet cadastrado</Text>
        <Text style={styles.petInfoText}>
          Espécie: <Text style={styles.petInfoStrong}>{petSpecies}</Text>
        </Text>
        <Text style={styles.petInfoText}>
          Raça: <Text style={styles.petInfoStrong}>{petBreed}</Text>
        </Text>
        <Text style={styles.petInfoText}>
          Clínica: <Text style={styles.petInfoStrong}>{petClinic}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.preventivoButton}
        onPress={() => navigation.navigate('Preventive')}
      >
        <View style={styles.preventivoButtonContent}>
          <MaterialCommunityIcons name="calendar-check" size={20} color="#2563EB" />
          <Text style={styles.preventivoButtonText}>Calendário Preventivo</Text>
          {pendentes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pendentes} pendente{pendentes > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Alertas ativos</Text>
      {homeAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          title={alert.title}
          message={alert.message}
          severity={alert.severity}
        />
      ))}

      <Text style={styles.sectionTitle}>Próximas ações</Text>
      {preventivos.slice(0, 2).map((item) => (
        <PreventiveItem
          key={item.id}
          title={item.title}
          date={item.date}
          description={item.description}
          done={item.done}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingBottom: 40 },
  subtitle: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 20 },
  petInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  petInfoTitle: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  petInfoText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  petInfoStrong: { fontWeight: 'bold', color: '#0F172A' },
  preventivoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  preventivoButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  preventivoButtonText: { fontSize: 15, fontWeight: '600', color: '#2563EB' },
  badge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: '#1D4ED8', fontWeight: '600' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 8,
  },
});