import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { EventoPreventivoResponse, TipoEventoPreventivo } from '../types/api';

export const TIPO_ICON: Record<TipoEventoPreventivo, keyof typeof MaterialCommunityIcons.glyphMap> = {
  VACINA: 'needle',
  CHECKUP: 'stethoscope',
  VERMIFUGO: 'bug-outline',
  RETORNO: 'calendar-clock',
  MEDICAMENTO: 'pill',
};

export const TIPO_LABEL: Record<TipoEventoPreventivo, string> = {
  VACINA: 'Vacina',
  CHECKUP: 'Check-up',
  VERMIFUGO: 'Vermífugo',
  RETORNO: 'Retorno',
  MEDICAMENTO: 'Medicamento',
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// Datas locais (não usa toISOString, que converte pra UTC e pode virar o dia
// errado perto da meia-noite no fuso do Brasil).
export function todayIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function shiftIsoDate(iso: string, deltaDays: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + deltaDays);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isValidIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isOverdue(evento: EventoPreventivoResponse): boolean {
  return evento.status === 'PENDENTE' && evento.dataPrevista < todayIsoDate();
}

export function statusColor(evento: EventoPreventivoResponse): string {
  if (evento.status === 'REALIZADO') return colors.success;
  if (isOverdue(evento)) return colors.danger;
  return colors.bluePrimary;
}

export function formatIsoDateBr(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function statusLabel(evento: EventoPreventivoResponse): string {
  if (evento.status === 'REALIZADO') {
    return evento.dataRealizacao ? `Concluído em ${formatIsoDateBr(evento.dataRealizacao)}` : 'Concluído';
  }
  if (isOverdue(evento)) return `Atrasado — previsto para ${formatIsoDateBr(evento.dataPrevista)}`;
  return `Previsto para ${formatIsoDateBr(evento.dataPrevista)}`;
}

export function computeStreak(eventos: EventoPreventivoResponse[]): number {
  const diasComMedicamento = new Set(
    eventos
      .filter((e) => e.tipo === 'MEDICAMENTO' && e.status === 'REALIZADO' && e.dataRealizacao)
      .map((e) => e.dataRealizacao as string)
  );

  if (diasComMedicamento.size === 0) return 0;

  const hoje = todayIsoDate();
  let cursor = diasComMedicamento.has(hoje) ? hoje : shiftIsoDate(hoje, -1);

  if (!diasComMedicamento.has(cursor)) return 0;

  let streak = 0;
  while (diasComMedicamento.has(cursor)) {
    streak += 1;
    cursor = shiftIsoDate(cursor, -1);
  }
  return streak;
}
