import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { homeAlerts, petSummary, preventiveItems } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getPetProfile, type PetProfile } from '../storage/petStorage';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function carregarPerfil() {
        const perfilSalvo = await getPetProfile();

        if (isActive) {
          setPetProfile(perfilSalvo);
        }
      }

      carregarPerfil();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const petName = petProfile?.nome || petSummary.nome;
  const petSpecies = petProfile?.especie || petSummary.especie;
  const petBreed = petProfile?.raca || petSummary.raca;
  const petClinic = petProfile?.clinica || 'Clínica não vinculada';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PetCare Hub</Text>

      <Text style={styles.subtitle}>
        Monitoramento contínuo para transformar cuidado reativo em cuidado
        preventivo.
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

      <Text style={styles.sectionTitle}>Módulos do app</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Collar')}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="tag" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Coleira</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Feeder')}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="bowl" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Comedouro</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Environment')}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="home-thermometer-outline" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Ambiente</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Preventive')}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="calendar-check" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Preventivo</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('PetProfile')}
      >
        <Text style={styles.profileButtonText}>Editar perfil do pet</Text>
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

      {preventiveItems.slice(0, 2).map((item) => (
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  petInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  petInfoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  petInfoText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  petInfoStrong: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    width: '48%',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  profileButton: {
    borderWidth: 1,
    borderColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },
  profileButtonText: {
    color: '#2563EB',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
