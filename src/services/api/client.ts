export const API_BASE_URL = 'https://petcare-hub-gokt.onrender.com';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

type ApiRequestOptions = RequestInit & {
  token?: string;
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, timeoutMs = 20000, headers, ...rest } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Erro ${response.status}`;
      try {
        const body = await response.json();
        const mensagem: string | null = body?.mensagem || body?.message || body?.erro || body?.error || null;
        const detalhes: string | null =
          Array.isArray(body?.detalhes) && body.detalhes.length > 0 ? body.detalhes.join('; ') : null;

        if (mensagem && detalhes) {
          message = `${mensagem}: ${detalhes}`;
        } else {
          message = mensagem || detalhes || message;
        }
      } catch {
        // resposta sem corpo JSON, mantém a mensagem padrão
      }
      throw new ApiError(response.status, message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(0, 'Tempo de conexão esgotado.');
    }
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  } finally {
    clearTimeout(timeout);
  }
}

const COLD_START_TIMEOUT_MS = 60_000;
const RETRY_DELAY_MS = 3_000;

export async function requestWithColdStartRetry<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  try {
    return await apiRequest<T>(path, { timeoutMs: COLD_START_TIMEOUT_MS, ...options });
  } catch (error) {
    const isRetryable = error instanceof ApiError && (error.status === 503 || error.status === 0);
    if (!isRetryable) throw error;

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    return await apiRequest<T>(path, { timeoutMs: COLD_START_TIMEOUT_MS, ...options });
  }
}
