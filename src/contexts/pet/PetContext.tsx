import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePets } from '../../hooks/queries/usePets';
import type { PetResponse } from '../../types/api';

type PetContextValue = {
  pets: PetResponse[];
  selectedPetId: number | null;
  selectedPet: PetResponse | null;
  setSelectedPetId: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

const PetContext = createContext<PetContextValue | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const { data: pets = [], isLoading, isError, error, refetch } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedPetId == null && pets.length > 0) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;

  const value = useMemo<PetContextValue>(
    () => ({ pets, selectedPetId, selectedPet, setSelectedPetId, isLoading, isError, error, refetch }),
    [pets, selectedPetId, selectedPet, isLoading, isError, error, refetch]
  );

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePetContext() {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePetContext precisa estar dentro de um PetProvider');
  return context;
}
