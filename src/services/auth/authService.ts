import { requestWithColdStartRetry, ApiError } from '../api/client';

export type LoginResponse = {
  token: string;
  tipo: string;
  expiraEm: string;
  role: string;
  tutorId?: number;
  clinicaId?: number;
};

const SLOW_CONNECTION_WARNING_MS = 5_000;

async function postWithSlowConnectionNotice(
  path: string,
  body: Record<string, unknown>,
  onSlowConnection?: () => void
): Promise<LoginResponse> {
  const slowTimer = onSlowConnection ? setTimeout(onSlowConnection, SLOW_CONNECTION_WARNING_MS) : null;

  try {
    return await requestWithColdStartRetry<LoginResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } finally {
    if (slowTimer) clearTimeout(slowTimer);
  }
}

export async function login(email: string, password: string, onSlowConnection?: () => void) {
  try {
    return await postWithSlowConnectionNotice('/auth/login', { email, password }, onSlowConnection);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError(401, 'E-mail ou senha incorretos.');
    }
    throw error;
  }
}

export async function ativarConta(
  nome: string,
  cpf: string,
  email: string,
  senha: string,
  onSlowConnection?: () => void
) {
  try {
    return await postWithSlowConnectionNotice('/auth/ativar-conta', { nome, cpf, email, senha }, onSlowConnection);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError(401, 'Não localizamos um pré-cadastro com esses dados. Verifique nome, CPF e e-mail informados pela clínica.');
    }
    throw error;
  }
}
