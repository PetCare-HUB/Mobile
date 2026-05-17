import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AlertCard } from '../components/AlertCard';
import { PreventiveItem } from '../components/PreventiveItem';
import { ScoreCard } from '../components/ScoreCard';
import { homeAlerts, petSummary, preventiveItems } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PetCare Hub</Text>

      <Text style={styles.subtitle}>
        Monitoramento contínuo para transformar cuidado reativo em cuidado
        preventivo.
      </Text>

      <ScoreCard
        petName={petSummary.nome}
        score={petSummary.score}
        status={petSummary.status}
      />

      <Text style={styles.sectionTitle}>Módulos do app</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Collar')}
        >
          <Text style={styles.buttonText}>🐾 Coleira</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Feeder')}
        >
          <Text style={styles.buttonText}>🍽️ Comedouro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Environment')}
        >
          <Text style={styles.buttonText}>🏠 Ambiente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Preventive')}
        >
          <Text style={styles.buttonText}>📅 Preventivo</Text>
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