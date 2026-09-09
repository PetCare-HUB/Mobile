import type {
  AlertItem,
  PetSummary,
  PreventiveItemType,
  SensorMetric,
} from '../types/pet';

export const petSummary: PetSummary = {
  id: 1,
  nome: 'Rex',
  especie: 'Cachorro',
  raca: 'Golden Retriever',
  score: 82,
  status: 'healthy',
  atividadeAtual: 'Ativo',
};

export const homeAlerts: AlertItem[] = [
  {
    id: 1,
    title: 'Redução na atividade',
    message: 'Rex está menos ativo que o normal nas últimas 24h. Observe seu comportamento.',
    severity: 'high',
    timeAgo: 'Há 2 horas',
  },
  {
    id: 2,
    title: 'Bateria da coleira baixa',
    message: 'A bateria está com 20%. Carregue em breve.',
    severity: 'medium',
    timeAgo: 'Há 5 horas',
  },
  {
    id: 3,
    title: 'Ambiente em atenção',
    message: 'Temperatura acima do ideal (28°C). Verifique o ambiente.',
    severity: 'low',
    timeAgo: 'Hoje, 10:24',
  },
  {
    id: 4,
    title: 'Vacina anual próxima',
    message: 'Está na hora da vacina anual do Rex.',
    severity: 'low',
    timeAgo: 'Em 12 dias',
  },
];

export const collarMetrics: SensorMetric[] = [
  {
    id: 1,
    title: 'Status atual',
    value: 'Ativo',
    description: 'O pet apresentou movimentação normal nos últimos minutos.',
    status: 'healthy',
  },
  {
    id: 2,
    title: 'Bateria da coleira',
    value: '78%',
    description: 'Bateria em nível seguro para monitoramento contínuo.',
    status: 'healthy',
  },
  {
    id: 3,
    title: 'Atividade nas últimas 24h',
    value: 'Moderada',
    description: 'Padrão compatível com o histórico do pet.',
    status: 'healthy',
  },
];

export const feederMetrics: SensorMetric[] = [
  {
    id: 1,
    title: 'Nível de ração',
    value: '35%',
    description: 'O comedouro ainda possui ração, mas está abaixo do ideal.',
    status: 'attention',
  },
  {
    id: 2,
    title: 'Consumo de hoje',
    value: '220g',
    description: 'Consumo dentro da média esperada para o perfil cadastrado.',
    status: 'healthy',
  },
  {
    id: 3,
    title: 'Última refeição',
    value: '13:40',
    description: 'Última leitura registrada pelo comedouro inteligente.',
    status: 'healthy',
  },
];

export const environmentMetrics: SensorMetric[] = [
  {
    id: 1,
    title: 'Temperatura ambiente',
    value: '24°C',
    description: 'Temperatura confortável para permanência do pet.',
    status: 'healthy',
  },
  {
    id: 2,
    title: 'Umidade',
    value: '62%',
    description: 'Umidade dentro de uma faixa aceitável.',
    status: 'healthy',
  },
  {
    id: 3,
    title: 'Qualidade do ar',
    value: 'Boa',
    description: 'Sensor MQ-135 indica ambiente sem alerta crítico.',
    status: 'healthy',
  },
  {
    id: 4,
    title: 'Presença no cômodo',
    value: 'Detectado',
    description: 'Sensor PIR identificou presença do pet no ambiente.',
    status: 'healthy',
  },
];

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

export const preventiveItems: PreventiveItemType[] = [
  {
    id: 1,
    title: 'Vacina anual',
    tipo: 'VACINA',
    date: 'Em 12 dias – 15/12/2026',
    description: 'Reforço recomendado para manter o protocolo vacinal em dia.',
    done: false,
  },
  {
    id: 2,
    title: 'Check-up preventivo',
    tipo: 'RETORNO',
    date: 'Em 45 dias – 18/01/2027',
    description: 'Consulta preventiva para avaliação geral de saúde.',
    done: false,
  },
  {
    id: 3,
    title: 'Vermífugo',
    tipo: 'VERMIFUGO',
    date: 'Concluído em 10/09/2026',
    description: 'Controle preventivo contra verminoses.',
    done: true,
  },
  {
    id: 4,
    title: 'Medicamento diário',
    tipo: 'MEDICAMENTO',
    date: 'Hoje',
    description: 'Controle de adesão ao tratamento indicado pela clínica.',
    done: true,
  },
  {
    id: 5,
    title: 'Exame de sangue',
    tipo: 'CHECKUP',
    date: 'Em 3 meses – 10/02/2027',
    description: 'Exame preventivo de rotina.',
    done: false,
  },
  {
    id: 6,
    title: 'Limpeza dental',
    tipo: 'CHECKUP',
    date: 'Atrasado há 5 dias – 01/11/2026',
    description: 'Procedimento preventivo de higiene bucal.',
    done: false,
    overdue: true,
  },
];