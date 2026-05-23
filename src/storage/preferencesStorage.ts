import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFS_KEY = '@petcarehub:preferences';

export type Preferences = {
  notifAlertas: boolean;
  notifPreventivo: boolean;
  notifRacao: boolean;
};

const defaultPreferences: Preferences = {
  notifAlertas: true,
  notifPreventivo: true,
  notifRacao: true,
};

export async function savePreferences(prefs: Preferences): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.log('Erro ao salvar preferências:', error);
  }
}

export async function getPreferences(): Promise<Preferences> {
  try {
    const data = await AsyncStorage.getItem(PREFS_KEY);
    if (!data) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(data) };
  } catch {
    return defaultPreferences;
  }
}