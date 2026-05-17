import AsyncStorage from '@react-native-async-storage/async-storage';

import { preventiveItems } from '../data/mockData';
import type { PreventiveItemType } from '../types/pet';

const PREVENTIVE_ITEMS_KEY = '@petcarehub:preventive_items';

export async function savePreventiveItems(items: PreventiveItemType[]) {
  try {
    const data = JSON.stringify(items);
    await AsyncStorage.setItem(PREVENTIVE_ITEMS_KEY, data);
  } catch (error) {
    console.log('Erro ao salvar calendário preventivo:', error);
    throw error;
  }
}

export async function getPreventiveItems(): Promise<PreventiveItemType[]> {
  try {
    const data = await AsyncStorage.getItem(PREVENTIVE_ITEMS_KEY);

    if (!data) {
      return preventiveItems;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log('Erro ao carregar calendário preventivo:', error);
    return preventiveItems;
  }
}

export async function resetPreventiveItems() {
  try {
    await AsyncStorage.removeItem(PREVENTIVE_ITEMS_KEY);
  } catch (error) {
    console.log('Erro ao resetar calendário preventivo:', error);
    throw error;
  }
}