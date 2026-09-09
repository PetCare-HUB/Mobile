import { useLocalSearchParams } from 'expo-router';
import { AlertaDetailScreen } from '../../src/screens/AlertaDetailScreen';

export default function AlertaDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AlertaDetailScreen id={id} />;
}
