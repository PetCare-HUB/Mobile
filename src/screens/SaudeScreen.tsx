import { useState } from 'react';

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

export function SaudeScreen() {
  const [tab, setTab] = useState<SaudeTab>('coleira');

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
