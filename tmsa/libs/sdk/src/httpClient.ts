export interface HttpClientOptions {
  baseUrl: string;
  apiKey?: string;
  defaultHeaders?: Record<string, string>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.defaultHeaders = options.defaultHeaders ?? { 'Content-Type': 'application/json' };
  }

  private buildHeaders(extra?: Record<string, string>) {
    return {
      ...this.defaultHeaders,
      ...(this.apiKey && { 'x-internal-api-key': this.apiKey }),
      ...extra,
    };
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...(init ?? {}),
      method: 'GET',
      headers: this.buildHeaders(init?.headers as Record<string, string> | undefined),
    });
    if (!response.ok) {
      throw new Error(`GET ${path} failed with ${response.status}`);
    }
    return (await response.json()) as T;
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...(init ?? {}),
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: this.buildHeaders(init?.headers as Record<string, string> | undefined),
    });
    if (!response.ok) {
      throw new Error(`POST ${path} failed with ${response.status}`);
    }
    return (await response.json()) as T;
  }
}
