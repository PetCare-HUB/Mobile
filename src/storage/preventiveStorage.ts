import AsyncStorage from '@react-native-async-storage/async-storage';
import { preventiveItems } from '../data/mockData';
import type { PreventiveItemType } from '../types/pet';

const PREVENTIVE_ITEMS_KEY = '@petcarehub:preventive_items';
const STREAK_KEY = '@petcarehub:streak';
const STREAK_DATE_KEY = '@petcarehub:streak_date';

export async function savePreventiveItems(items: PreventiveItemType[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PREVENTIVE_ITEMS_KEY, JSON.stringify(items));
    await updateStreak(items);
  } catch (error) {
    console.log('Erro ao salvar calendário:', error);
  }
}

export async function getPreventiveItems(): Promise<PreventiveItemType[]> {
  try {
    const data = await AsyncStorage.getItem(PREVENTIVE_ITEMS_KEY);
    if (!data) return preventiveItems;
    return JSON.parse(data);
  } catch {
    return preventiveItems;
  }
}

export async function resetPreventiveItems(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([PREVENTIVE_ITEMS_KEY, STREAK_KEY, STREAK_DATE_KEY]);
  } catch (error) {
    console.log('Erro ao resetar:', error);
  }
}

async function updateStreak(items: PreventiveItemType[]): Promise<void> {
  try {
    const medicamentoFeito = items.some((item) => item.id === 4 && item.done);
    if (!medicamentoFeito) return;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = await AsyncStorage.getItem(STREAK_DATE_KEY);
    if (lastDate === today) return;

    const streakRaw = await AsyncStorage.getItem(STREAK_KEY);
    const currentStreak = streakRaw ? parseInt(streakRaw, 10) : 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = lastDate === yesterday.toISOString().split('T')[0] ? currentStreak + 1 : 1;

    await AsyncStorage.multiSet([[STREAK_KEY, String(newStreak)], [STREAK_DATE_KEY, today]]);
  } catch (error) {
    console.log('Erro ao atualizar streak:', error);
  }
}

export async function getStreak(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}