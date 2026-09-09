import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { AlertCard } from '../components/AlertCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { homeAlerts } from '../data/mockData';

export function AlertasScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <SectionHeader
        title="Alertas"
        subtitle="Acompanhe os sinais identificados nos sensores do Rex."
        level="page"
      />

      {homeAlerts.map((alert) => (
        <TouchableOpacity key={alert.id} onPress={() => router.push(`/alertas/${alert.id}`)} activeOpacity={0.8}>
          <AlertCard title={alert.title} message={alert.message} severity={alert.severity} />
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
}
