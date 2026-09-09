import { apiRequest, ApiError } from '../api/client';

export type LoginResponse = {
  token: string;
  tipo: string;
  expiraEm: string;
  role: string;
  tutorId?: number;
  clinicaId?: number;
};

const COLD_START_TIMEOUT_MS = 60_000;
const SLOW_CONNECTION_WARNING_MS = 5_000;
const RETRY_DELAY_MS = 3_000;

async function requestWithColdStartRetry(
  path: string,
  body: Record<string, unknown>,
  onSlowConnection?: () => void
): Promise<LoginResponse> {
  const slowTimer = onSlowConnection ? setTimeout(onSlowConnection, SLOW_CONNECTION_WARNING_MS) : null;

  try {
    return await apiRequest<LoginResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      timeoutMs: COLD_START_TIMEOUT_MS,
    });
  } catch (error) {
    const isRetryable = error instanceof ApiError && (error.status === 503 || error.status === 0);
    if (!isRetryable) throw error;

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    return await apiRequest<LoginResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      timeoutMs: COLD_START_TIMEOUT_MS,
    });
  } finally {
    if (slowTimer) clearTimeout(slowTimer);
  }
}

export async function login(email: string, password: string, onSlowConnection?: () => void) {
  try {
    return await requestWithColdStartRetry('/auth/login', { email, password }, onSlowConnection);
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
    return await requestWithColdStartRetry('/auth/ativar-conta', { nome, cpf, email, senha }, onSlowConnection);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError(401, 'Não localizamos um pré-cadastro com esses dados. Verifique nome, CPF e e-mail informados pela clínica.');
    }
    throw error;
  }
}
