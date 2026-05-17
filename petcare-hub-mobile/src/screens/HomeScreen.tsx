import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PetCare Hub</Text>

      <Text style={styles.subtitle}>
        Acompanhe a saúde do seu pet de forma contínua e preventiva.
      </Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Score de Saúde</Text>
        <Text style={styles.scoreValue}>82</Text>
        <Text style={styles.scoreStatus}>🟢 Saudável</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Collar')}
      >
        <Text style={styles.buttonText}>Coleira Smart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Feeder')}
      >
        <Text style={styles.buttonText}>Comedouro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Environment')}
      >
        <Text style={styles.buttonText}>Ambiente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Preventive')}
      >
        <Text style={styles.buttonText}>Calendário Preventivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('PetProfile')}
      >
        <Text style={styles.buttonSecondaryText}>Perfil do Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#475569',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  buttonSecondaryText: {
    color: '#2563EB',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});