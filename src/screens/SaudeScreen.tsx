import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { QueryState } from '../components/QueryState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { usePetContext } from '../contexts/pet/PetContext';
import { CollarSection } from './health/CollarSection';
import { EnvironmentSection } from './health/EnvironmentSection';
import { FeederSection } from './health/FeederSection';

type SaudeTab = 'coleira' | 'alimentacao' | 'ambiente';

const segments: { key: SaudeTab; label: string }[] = [
  { key: 'coleira', label: 'Coleira' },
  { key: 'alimentacao', label: 'Alimentação' },
  { key: 'ambiente', label: 'Ambiente' },
];

const VALID_TABS: SaudeTab[] = ['coleira', 'alimentacao', 'ambiente'];

export function SaudeScreen() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<SaudeTab>('coleira');
  const {
    selectedPetId,
    selectedPet,
    isLoading: petsLoading,
    isError: petsError,
    error: petsErrorDetail,
    refetch: refetchPets,
  } = usePetContext();

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam as SaudeTab)) {
      setTab(tabParam as SaudeTab);
    }
  }, [tabParam]);

  return (
    <ScreenContainer>
      <SectionHeader
        title={selectedPet ? `Saúde do ${selectedPet.nome}` : 'Saúde'}
        subtitle="Coleira, alimentação e ambiente em um só lugar."
        level="page"
      />

      <QueryState
        isLoading={petsLoading}
        isError={petsError}
        error={petsErrorDetail}
        data={selectedPetId}
        onRetry={refetchPets}
        emptyTitle="Nenhum pet cadastrado"
        emptyDescription="Assim que sua clínica vincular um pet à sua conta, ele aparece aqui."
      >
        {(petId) => (
          <>
            <SegmentedControl segments={segments} value={tab} onChange={setTab} />

            {tab === 'coleira' && <CollarSection petId={petId} />}
            {tab === 'alimentacao' && <FeederSection petId={petId} />}
            {tab === 'ambiente' && <EnvironmentSection petId={petId} />}
          </>
        )}
      </QueryState>
    </ScreenContainer>
  );
}
