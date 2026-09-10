import type { Especie, Sexo } from '../types/api';
import { isValidIsoDate, todayIsoDate } from './preventiveMappers';

export const ESPECIE_LABEL: Record<Especie, string> = {
  CAO: 'Cachorro',
  GATO: 'Gato',
  OUTRO: 'Outro',
};

export const SEXO_LABEL: Record<Sexo, string> = {
  M: 'Macho',
  F: 'Fêmea',
};

const MAX_IDADE_ANOS = 25;

function idadeEmAnos(dataNascimento: string): number {
  const [ano, mes, dia] = dataNascimento.split('-').map(Number);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario = hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

export function calcularIdade(dataNascimento: string | null): string {
  if (!dataNascimento || !isValidIsoDate(dataNascimento)) return 'Não informado';
  const anos = idadeEmAnos(dataNascimento);
  return anos === 1 ? '1 ano' : `${anos} anos`;
}

export function isValidBirthDate(dataNascimento: string): boolean {
  if (!isValidIsoDate(dataNascimento)) return false;
  if (dataNascimento > todayIsoDate()) return false;
  return idadeEmAnos(dataNascimento) <= MAX_IDADE_ANOS;
}
