import * as SecureStore from 'expo-secure-store';
import { reloadAppAsync } from 'expo';

export type Esquema = 'light' | 'dark';

const CHAVE = 'petcarehub.tema';

/**
 * Tema escolhido no app, ou null se o usuario nunca escolheu (ai vale o do
 * sistema). A leitura e sincrona de proposito: a paleta e decidida quando o
 * modulo de cores carrega, antes de qualquer tela montar, e nao da para
 * esperar uma leitura assincrona nesse ponto.
 */
export function temaSalvo(): Esquema | null {
  try {
    const valor = SecureStore.getItem(CHAVE);
    return valor === 'light' || valor === 'dark' ? valor : null;
  } catch {
    return null;
  }
}

/**
 * Grava a escolha e reabre o app. Os estilos das telas sao montados uma vez,
 * no carregamento, entao a troca so aparece numa abertura nova. A sessao fica
 * no SecureStore, entao o usuario continua logado depois do reinicio.
 */
export async function aplicarTema(esquema: Esquema): Promise<void> {
  SecureStore.setItem(CHAVE, esquema);
  await reloadAppAsync('troca de tema');
}
