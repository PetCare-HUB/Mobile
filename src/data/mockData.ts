export const collarActivity = {
  connected: true,
  battery: 78,
  state: 'Ativo',
  stateSince: '10:24',
  steps: 8432,
  stepsChangePercent: 12,
  hourlyActivity: [20, 35, 60, 45, 30, 55, 80, 65, 40, 70, 90, 60, 35, 50, 75, 55],
  hourlyLabels: ['0h', '6h', '12h', '18h', '24h'],
  timeInState: [
    { key: 'repouso', label: 'Repouso', hours: '12h 20m', percent: 51 },
    { key: 'ativo', label: 'Ativo', hours: '8h 10m', percent: 34 },
    { key: 'muitoAtivo', label: 'Muito ativo', hours: '3h 20m', percent: 15 },
  ],
};

export const feederConsumption = {
  connected: true,
  reservoirPercent: 35,
  todayGrams: 220,
  averageGrams: 250,
  changePercent: -12,
  meals: [
    { time: '08:14', grams: 65 },
    { time: '13:22', grams: 58 },
    { time: '19:02', grams: 62 },
  ],
};

export const environmentSummary = {
  connected: true,
  comfortLabel: 'Confortável',
};

export const petTimeline = [
  { id: 1, date: 'Hoje', title: 'Alteração no padrão de atividade' },
  { id: 2, date: '01/09', title: 'Consulta preventiva' },
  { id: 3, date: '25/08', title: 'Score 84 → 89' },
  { id: 4, date: '12/08', title: 'Vacina aplicada' },
];