import { ERROR_MESSAGES } from '../constants/errors';

/**
 * Normalises any thrown value (Axios error, fetch error, JS Error, string)
 * into a consistent shape: { message, code, status, isNetwork, isTimeout }.
 */
export function normalizeError(error) {
  // Axios error with a server response
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;
    const code = data?.code || data?.error || String(status);
    const message =
      data?.message ||
      ERROR_MESSAGES[code] ||
      ERROR_MESSAGES.SERVER_ERROR;

    return { message, code, status, isNetwork: false, isTimeout: false };
  }

  // Network error (no response received)
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      message: ERROR_MESSAGES.TIMEOUT,
      code: 'TIMEOUT',
      status: null,
      isNetwork: true,
      isTimeout: true,
    };
  }

  if (error?.message === 'Network Error') {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
      status: null,
      isNetwork: true,
      isTimeout: false,
    };
  }

  // JS Error or string
  const message =
    (typeof error === 'string' ? error : error?.message) ||
    ERROR_MESSAGES.UNKNOWN;

  return { message, code: 'UNKNOWN', status: null, isNetwork: false, isTimeout: false };
}

/**
 * Extracts the server-sent error code from an Axios response error.
 */
export function getErrorCode(error) {
  return error?.response?.data?.code || null;
}
