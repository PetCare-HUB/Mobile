import { Appearance } from 'react-native';
import type { HealthStatus } from '../types/pet';
import { temaSalvo, type Esquema } from './temaPreferido';

// Duas paletas com os mesmos nomes: as telas continuam importando `colors` e
// recebem a do tema do sistema.
//
// A escolha acontece uma vez, na abertura do app. Os estilos das telas sao
// criados quando o modulo carrega (StyleSheet.create no topo do arquivo), entao
// trocar o tema com o app aberto so aparece na proxima vez que ele abrir.

const claro = {
  background: '#E6F1F8',
  surface: '#F3F8FC',

  greenPrimary: '#087F68',
  greenSecondary: '#35B99A',
  greenLight: '#E8F7F2',

  bluePrimary: '#246B9C',
  blueLight: '#EAF4FB',

  textPrimary: '#153449',
  textSecondary: '#667985',

  borderGray: '#E5ECEF',
  backgroundGray: '#F2F5F6',

  success: '#23A66F',
  warning: '#F0A83B',
  danger: '#E45454',
  aiPurple: '#6D63D9',

  // Fundos dos cartoes de alerta e da IA. Eram cores fixas nos componentes;
  // no tema escuro um fundo pastel com texto claro por cima fica ilegivel.
  dangerLight: '#FBE7E7',
  warningLight: '#FDF1DF',
  aiPurpleLight: '#EDEBFB',

  overlay: 'rgba(21, 52, 73, 0.4)',

  // Texto e icone sobre fundo de cor (botao verde, aba ativa). Branco nos dois
  // temas: o `surface` fazia esse papel, mas no escuro ele vira azul-escuro.
  onPrimary: '#FFFFFF',
};

export type Paleta = { readonly [K in keyof typeof claro]: string };

const escuro: Paleta = {
  background: '#0E1B24',
  surface: '#16252F',

  // O verde aparece como cor de texto e icone (sobre fundo escuro) e como fundo
  // de botao (com texto branco). Este tom e o meio-termo legivel nos dois usos.
  greenPrimary: '#129478',
  greenSecondary: '#3CC4A4',
  greenLight: '#123029',

  bluePrimary: '#5AA6D9',
  blueLight: '#152B3A',

  textPrimary: '#E3EDF3',
  textSecondary: '#94A8B5',

  borderGray: '#253742',
  backgroundGray: '#1C2C36',

  success: '#38C185',
  warning: '#F2B354',
  danger: '#EE6A6A',
  aiPurple: '#8E86EE',

  dangerLight: '#3B2125',
  warningLight: '#3A2E1A',
  aiPurpleLight: '#26234A',

  overlay: 'rgba(0, 0, 0, 0.6)',

  onPrimary: '#FFFFFF',
};

// A escolha feita no app (Perfil > Tema escuro) vence; sem escolha, vale o sistema.
export const esquemaDeCores: Esquema =
  temaSalvo() ?? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

export const colors: Paleta = esquemaDeCores === 'dark' ? escuro : claro;

export const healthStatusColor: Record<HealthStatus, string> = {
  healthy: colors.success,
  attention: colors.warning,
  risk: colors.danger,
};
