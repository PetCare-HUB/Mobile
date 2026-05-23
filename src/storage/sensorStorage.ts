import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SensorMetric } from '../types/pet';

const KEY_PREFIX = '@petcarehub:sensor_';

export async function saveSensorData(sensor: 'coleira' | 'comedouro' | 'ambiente', data: SensorMetric[]) {
  try {
    await AsyncStorage.setItem(KEY_PREFIX + sensor, JSON.stringify(data));
  } catch (error) {
    console.log('Erro ao salvar sensor:', error);
  }
}

export async function getSensorData(sensor: 'coleira' | 'comedouro' | 'ambiente'): Promise<SensorMetric[] | null> {
  try {
    const data = await AsyncStorage.getItem(KEY_PREFIX + sensor);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}