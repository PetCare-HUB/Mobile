import AsyncStorage from '@react-native-async-storage/async-storage';

const PET_PROFILE_KEY = '@petcarehub:pet_profile';

export type PetProfile = {
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  clinica: string;
  sexo?: string;
  microchip?: string;
  observacoes?: string;
};

export async function savePetProfile(profile: PetProfile) {
  try {
    const data = JSON.stringify(profile);
    await AsyncStorage.setItem(PET_PROFILE_KEY, data);
  } catch (error) {
    console.log('Erro ao salvar perfil do pet:', error);
    throw error;
  }
}

export async function getPetProfile(): Promise<PetProfile | null> {
  try {
    const data = await AsyncStorage.getItem(PET_PROFILE_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log('Erro ao carregar perfil do pet:', error);
    return null;
  }
}

export async function removePetProfile() {
  try {
    await AsyncStorage.removeItem(PET_PROFILE_KEY);
  } catch (error) {
    console.log('Erro ao remover perfil do pet:', error);
    throw error;
  }
}