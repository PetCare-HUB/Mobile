import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { HealthStatus } from '../types/pet';
import type { LeituraAmbienteResponse, LeituraColeiraResponse, LeituraComedouroResponse, StatusAtividade } from '../types/api';

export type LeituraRange = 'hoje' | '7dias' | '30dias';

export const STATUS_ATIVIDADE_LABEL: Record<StatusAtividade, string> = {
  DORMINDO: 'Repouso',
  ATIVO: 'Ativo',
  BRINCANDO: 'Brincando',
};

export const STATUS_ATIVIDADE_ICON: Record<StatusAtividade, keyof typeof MaterialCommunityIcons.glyphMap> = {
  DORMINDO: 'sleep',
  ATIVO: 'run',
  BRINCANDO: 'tennis-ball',
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
  if (range === '30dias') return leituras;

  const now = Date.now();
  const windowMs = range === 'hoje' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  return leituras.filter((leitura) => now - new Date(leitura.timestampLeitura).getTime() <= windowMs);
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
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function computeTimeInState(leituras: LeituraColeiraResponse[]): TimeInStateItem[] {
  const ordenadas = [...leituras].sort(
    (a, b) => new Date(a.timestampLeitura).getTime() - new Date(b.timestampLeitura).getTime()
  );

  const durationMs: Record<StatusAtividade, number> = { DORMINDO: 0, ATIVO: 0, BRINCANDO: 0 };

  for (let i = 0; i < ordenadas.length; i += 1) {
    const atual = ordenadas[i];
    const proximoTimestamp = i + 1 < ordenadas.length ? new Date(ordenadas[i + 1].timestampLeitura).getTime() : Date.now();
    const duracao = proximoTimestamp - new Date(atual.timestampLeitura).getTime();
    durationMs[atual.statusAtividade] += Math.max(duracao, 0);
  }

  const total = durationMs.DORMINDO + durationMs.ATIVO + durationMs.BRINCANDO;

  const ordem: StatusAtividade[] = ['DORMINDO', 'ATIVO', 'BRINCANDO'];
  return ordem.map((key) => ({
    key,
    label: STATUS_ATIVIDADE_LABEL[key],
    hours: formatHoursMinutes(durationMs[key]),
    percent: total > 0 ? Math.round((durationMs[key] / total) * 100) : 0,
  }));
}

const INTENSIDADE_ATIVIDADE: Record<StatusAtividade, number> = { DORMINDO: 1, ATIVO: 2, BRINCANDO: 3 };

export function activityBars(leituras: LeituraColeiraResponse[], range: LeituraRange): { data: number[]; labels: string[] } {
  const ordenadas = [...leituras].sort(
    (a, b) => new Date(a.timestampLeitura).getTime() - new Date(b.timestampLeitura).getTime()
  );
  const ultimas = ordenadas.slice(-10);
  const formatLabel = range === 'hoje' ? formatTimeHm : formatDateDdMm;

  return {
    data: ultimas.map((leitura) => INTENSIDADE_ATIVIDADE[leitura.statusAtividade]),
    labels: ultimas.map((leitura) => formatLabel(leitura.timestampLeitura)),
  };
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

export function ultimasRefeicoes(leituras: LeituraComedouroResponse[]): { time: string; grams: number }[] {
  return leituras
    .slice(0, 10)
    .reverse()
    .map((leitura) => ({
      time: formatTimeHm(leitura.timestampLeitura),
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

export function statusTemperatura(value: number): HealthStatus {
  return value >= 10 && value <= 32 ? 'healthy' : 'attention';
}

export function statusUmidade(value: number): HealthStatus {
  return value >= 30 && value <= 75 ? 'healthy' : 'attention';
}

export function statusQualidadeAr(value: number): HealthStatus {
  return value <= 1000 ? 'healthy' : 'attention';
}
