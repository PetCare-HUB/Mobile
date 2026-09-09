import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
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

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam as SaudeTab)) {
      setTab(tabParam as SaudeTab);
    }
  }, [tabParam]);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Saúde do Rex"
        subtitle="Coleira, alimentação e ambiente em um só lugar."
        level="page"
      />

      <SegmentedControl segments={segments} value={tab} onChange={setTab} />

      {tab === 'coleira' && <CollarSection />}
      {tab === 'alimentacao' && <FeederSection />}
      {tab === 'ambiente' && <EnvironmentSection />}
    </ScreenContainer>
  );
}
