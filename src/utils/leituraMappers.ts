import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { HealthStatus } from '../types/pet';
import type { LeituraAmbienteResponse, LeituraColeiraResponse, LeituraComedouroResponse, StatusAtividade } from '../types/api';

export type LeituraRange = 'hoje' | '7dias' | '30dias';

export const STATUS_ATIVIDADE_LABEL: Record<StatusAtividade, string> = {
  SEDENTARIO: 'Sedentário',
  MODERADO: 'Moderado',
  ATIVO: 'Ativo',
};

export const STATUS_ATIVIDADE_ICON: Record<StatusAtividade, keyof typeof MaterialCommunityIcons.glyphMap> = {
  SEDENTARIO: 'sleep',
  MODERADO: 'walk',
  ATIVO: 'run',
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatTimeHm(isoString: string): string {
  const date = new Date(isoString);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateDdMm(isoString: string): string {
  const date = new Date(isoString);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

function isSameDay(isoString: string, reference: Date): boolean {
  const date = new Date(isoString);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function dateKey(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function filterByRange<T extends { timestampLeitura: string }>(leituras: T[], range: LeituraRange): T[] {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (range === '7dias') start.setDate(start.getDate() - 6);
  if (range === '30dias') start.setDate(start.getDate() - 29);

  return leituras.filter((leitura) => {
    const timestamp = new Date(leitura.timestampLeitura).getTime();
    return Number.isFinite(timestamp) && timestamp >= start.getTime() && timestamp <= now.getTime();
  });
}

export function computeSinceLabel(leituras: LeituraColeiraResponse[]): string | null {
  if (leituras.length === 0) return null;

  const estadoAtual = leituras[0].statusAtividade;
  let ultimaComMesmoEstado = leituras[0];
  for (const leitura of leituras) {
    if (leitura.statusAtividade !== estadoAtual) break;
    ultimaComMesmoEstado = leitura;
  }
  return formatTimeHm(ultimaComMesmoEstado.timestampLeitura);
}

type TimeInStateItem = { key: StatusAtividade; label: string; hours: string; percent: number };

function formatHoursMinutes(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMinutesExact = ms / 60_000;
  if (totalMinutesExact < 60) return `${totalMinutesExact.toFixed(1)}m`;

  const totalMinutes = Math.round(totalMinutesExact);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export function computeTimeInState(leituras: LeituraColeiraResponse[]): TimeInStateItem[] {
  const ordenadas = [...leituras].sort(
    (a, b) => new Date(a.timestampLeitura).getTime() - new Date(b.timestampLeitura).getTime()
  );

  const durationMs: Record<StatusAtividade, number> = { SEDENTARIO: 0, MODERADO: 0, ATIVO: 0 };

  const intervals = ordenadas.slice(1).map((leitura, index) =>
    new Date(leitura.timestampLeitura).getTime() - new Date(ordenadas[index].timestampLeitura).getTime()
  ).filter((interval) => interval > 0);
  const sortedIntervals = [...intervals].sort((a, b) => a - b);
  const typicalInterval = sortedIntervals.length > 0
    ? sortedIntervals[Math.floor(sortedIntervals.length / 2)]
    : 0;
  // Não atribui dias inteiros a um estado quando houve uma pausa longa no envio.
  const maxInferredInterval = typicalInterval > 0 ? typicalInterval * 1.5 : 0;
  const now = Date.now();

  for (let i = 0; i < ordenadas.length - 1; i += 1) {
    const atual = ordenadas[i];
    const atualTimestamp = new Date(atual.timestampLeitura).getTime();
    const proximoTimestamp = new Date(ordenadas[i + 1].timestampLeitura).getTime();
    const duracao = Math.min(proximoTimestamp - atualTimestamp, maxInferredInterval);
    durationMs[atual.statusAtividade] += Math.max(duracao, 0);
  }

  // Estima após a última amostra somente até um intervalo típico, nunca até agora sem limite.
  const ultima = ordenadas[ordenadas.length - 1];
  if (ultima && maxInferredInterval > 0) {
    const timestamp = new Date(ultima.timestampLeitura).getTime();
    const restante = Math.min(maxInferredInterval, Math.max(0, now - timestamp));
    durationMs[ultima.statusAtividade] += restante;
  }

  const total = durationMs.SEDENTARIO + durationMs.MODERADO + durationMs.ATIVO;

  const ordem: StatusAtividade[] = ['SEDENTARIO', 'MODERADO', 'ATIVO'];
  return ordem.map((key) => ({
    key,
    label: STATUS_ATIVIDADE_LABEL[key],
    hours: formatHoursMinutes(durationMs[key]),
    percent: total > 0 ? Math.round((durationMs[key] / total) * 100) : 0,
  }));
}

const INTENSIDADE_ATIVIDADE: Record<StatusAtividade, number> = { SEDENTARIO: 1, MODERADO: 2, ATIVO: 3 };

export function activityBars(
  leituras: LeituraColeiraResponse[],
  range: LeituraRange,
): { data: number[]; labels: string[]; barColors: string[] } {
  const chart = aggregateHistory(leituras, range, (leitura) => INTENSIDADE_ATIVIDADE[leitura.statusAtividade], 'average');
  return {
    ...chart,
    barColors: chart.data.map((value) =>
      value < 1.5 ? colors.danger : value < 2.5 ? colors.warning : colors.success
    ),
  };
}

type HistoryBucket = { start: Date; end: Date; label: string };

function makeHistoryBuckets(range: LeituraRange): HistoryBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (range === 'hoje') {
    return Array.from({ length: 8 }, (_, index) => {
      const start = new Date(today);
      start.setHours(index * 3);
      const end = new Date(start);
      end.setHours(end.getHours() + 3);
      return { start, end, label: formatTimeHm(start.toISOString()) };
    });
  }

  if (range === '7dias') {
    return Array.from({ length: 7 }, (_, index) => {
      const start = new Date(today);
      start.setDate(start.getDate() - (6 - index));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { start, end, label: formatDateDdMm(start.toISOString()) };
    });
  }

  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - 29);
  const firstMonday = new Date(rangeStart);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));
  const buckets: HistoryBucket[] = [];

  for (let weekStart = firstMonday; weekStart < tomorrow; weekStart = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const visibleStart = new Date(Math.max(weekStart.getTime(), rangeStart.getTime()));
    const visibleEnd = new Date(Math.min(weekEnd.getTime(), tomorrow.getTime()));
    buckets.push({
      start: visibleStart,
      end: visibleEnd,
      label: `${formatDateDdMm(visibleStart.toISOString())}\n${formatDateDdMm(new Date(visibleEnd.getTime() - 1).toISOString())}`,
    });
  }
  return buckets;
}

function aggregateHistory<T extends { timestampLeitura: string }>(
  leituras: T[],
  range: LeituraRange,
  valueOf: (leitura: T) => number,
  aggregation: 'sum' | 'average',
): { data: number[]; labels: string[] } {
  const periods = makeHistoryBuckets(range);
  const buckets = periods.map(() => ({ total: 0, samples: 0 }));

  for (const leitura of leituras) {
    const timestamp = new Date(leitura.timestampLeitura).getTime();
    const index = periods.findIndex((period) => timestamp >= period.start.getTime() && timestamp < period.end.getTime());
    if (index < 0) continue;
    buckets[index].total += valueOf(leitura);
    buckets[index].samples += 1;
  }

  return {
    data: buckets.map((bucket) => !bucket.samples ? 0 : aggregation === 'sum' ? bucket.total : bucket.total / bucket.samples),
    labels: periods.map((period) => period.label),
  };
}

export function feederHistoryBars(leituras: LeituraComedouroResponse[], range: LeituraRange) {
  const chart = aggregateHistory(leituras, range, (leitura) => leitura.pesoConsumidoG, 'sum');
  const max = Math.max(...chart.data, 0);
  return {
    ...chart,
    barColors: chart.data.map((value) => {
      if (value === 0) return colors.borderGray;
      if (value <= max / 3) return colors.danger;
      if (value <= (max * 2) / 3) return colors.warning;
      return colors.success;
    }),
  };
}

export function temperatureHistoryBars(leituras: LeituraAmbienteResponse[], range: LeituraRange) {
  const chart = aggregateHistory(leituras, range, (leitura) => leitura.temperaturaAmbiente, 'average');
  return {
    ...chart,
    barColors: chart.data.map((value) => {
      if (value < 10 || value > 32) return colors.danger;
      if (value < 15 || value > 28) return colors.warning;
      return colors.success;
    }),
  };
}

export function sumConsumption(leituras: LeituraComedouroResponse[]): number {
  return leituras.reduce((total, leitura) => total + leitura.pesoConsumidoG, 0);
}

export function sumConsumoHoje(leituras: LeituraComedouroResponse[]): number {
  const hoje = new Date();
  return leituras
    .filter((leitura) => isSameDay(leitura.timestampLeitura, hoje))
    .reduce((total, leitura) => total + leitura.pesoConsumidoG, 0);
}

export function mediaConsumoDiario(leituras: LeituraComedouroResponse[]): number {
  const hojeKey = dateKey(new Date().toISOString());
  const porDia = new Map<string, number>();

  for (const leitura of leituras) {
    const key = dateKey(leitura.timestampLeitura);
    if (key === hojeKey) continue;
    porDia.set(key, (porDia.get(key) ?? 0) + leitura.pesoConsumidoG);
  }

  const dias = [...porDia.values()];
  if (dias.length === 0) return sumConsumoHoje(leituras);
  return Math.round(dias.reduce((total, grams) => total + grams, 0) / dias.length);
}

export function ultimasRefeicoes(leituras: LeituraComedouroResponse[], range: LeituraRange = 'hoje'): { time: string; grams: number }[] {
  return leituras
    .slice()
    .sort((a, b) => new Date(b.timestampLeitura).getTime() - new Date(a.timestampLeitura).getTime())
    .slice(0, 10)
    .reverse()
    .map((leitura) => ({
      time: range === 'hoje'
        ? formatTimeHm(leitura.timestampLeitura)
        : `${formatDateDdMm(leitura.timestampLeitura)} ${formatTimeHm(leitura.timestampLeitura)}`,
      grams: Math.round(leitura.pesoConsumidoG),
    }));
}

export function isComfortable(leitura: LeituraAmbienteResponse): boolean {
  const temperaturaOk = leitura.temperaturaAmbiente >= 10 && leitura.temperaturaAmbiente <= 32;
  const umidadeOk = leitura.umidadePct >= 30 && leitura.umidadePct <= 75;
  const arOk = leitura.qualidadeArPpm <= 1000;
  return temperaturaOk && umidadeOk && arOk;
}

export function comfortLabel(leitura: LeituraAmbienteResponse): string {
  return isComfortable(leitura) ? 'Confortável' : 'Atenção necessária';
}

export function statusUmidade(value: number): HealthStatus {
  return value >= 30 && value <= 75 ? 'healthy' : 'attention';
}

export function statusQualidadeAr(value: number): HealthStatus {
  return value <= 1000 ? 'healthy' : 'attention';
}

export function batteryIcon(nivelBateria: number): keyof typeof MaterialCommunityIcons.glyphMap {
  if (nivelBateria < 20) return 'battery-alert';
  if (nivelBateria < 50) return 'battery-medium';
  return 'battery-high';
}

export function batteryColor(nivelBateria: number): string {
  if (nivelBateria < 20) return colors.danger;
  if (nivelBateria < 50) return colors.warning;
  return colors.success;
}

export function reservoirColor(nivelRacaoPct: number): string {
  if (nivelRacaoPct < 20) return colors.danger;
  if (nivelRacaoPct < 50) return colors.warning;
  return colors.success;
}

export function temperatureColor(temperaturaAmbiente: number): string {
  if (temperaturaAmbiente > 32) return colors.danger;
  if (temperaturaAmbiente < 10) return colors.bluePrimary;
  return colors.success;
}
