import type { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/** What a form needs in order to explain a failed request. */
interface ApiFailure {
  /** Human-readable messages reported by the API, possibly empty. */
  messages: string[];
  /** HTTP status, present only when the request reached the server. */
  status?: number;
}

/**
 * Extracts the human-readable messages from an API error.
 *
 * The API is not consistent about `message`: `ValidationPipe` rejects a request
 * with an *array* of messages (one per broken field), while anything thrown by
 * a service returns a single string. Reading `data.message` directly therefore
 * yields an array for validation failures, which renders as one run-on string
 * in a toast and tells the user nothing about which field is at fault.
 */
const readApiError = (error: unknown): ApiFailure => {
  // Already normalised by a previous call, so the helpers stay composable.
  if (error && typeof error === "object" && Array.isArray((error as ApiFailure).messages)) {
    return error as ApiFailure;
  }

  const failure = error as AxiosError<ApiErrorBody> | undefined;
  const body = failure?.response?.data;

  if (!body) return { messages: [] };

  if (Array.isArray(body.message)) {
    return { messages: body.message.filter((entry): entry is string => typeof entry === "string"), status: body.statusCode };
  }

  if (typeof body.message === "string" && body.message) {
    return { messages: [body.message], status: body.statusCode };
  }

  // `error` is only worth showing when it says something more specific than
  // the generic reason phrase Nest sends alongside every validation failure.
  if (body.error && body.error !== "Bad Request") {
    return { messages: [body.error], status: body.statusCode };
  }

  return { messages: [], status: body.statusCode };
};

/**
 * A single line suitable for a toast, e.g.
 * `email must be an email; password is not strong enough`.
 */
const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const { messages } = readApiError(error);

  return messages.length ? messages.join("; ") : fallback;
};

/**
 * Maps validation messages back onto the fields they belong to.
 *
 * class-validator prefixes each message with the property name (`email must be
 * an email`, `password is not strong enough`), so the field can be recovered
 * from the text. Anything that cannot be attributed is left out, and the
 * caller is expected to surface the remainder as a toast.
 */
const getApiFieldErrors = (error: unknown, fields: string[]): Record<string, string> => {
  const result: Record<string, string> = {};

  readApiError(error).messages.forEach((message) => {
    const field = fields.find((name) => message.toLowerCase().startsWith(name.toLowerCase()));

    if (field && !result[field]) result[field] = message;
  });

  return result;
};

export { getApiErrorMessage, getApiFieldErrors, readApiError };
export type { ApiFailure };
