import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { io, Socket } from 'socket.io-client';

export interface TMSAClientConfig {
  baseURL: string;
  apiKey?: string;
  accessToken?: string;
  onTokenExpired?: () => void;
  onError?: (error: any) => void;
}

export class TMSAClient {
  private http: AxiosInstance;
  private socket?: Socket;
  private config: TMSAClientConfig;
  private accessToken?: string;

  constructor(config: TMSAClientConfig) {
    this.config = config;
    this.accessToken = config.accessToken;

    this.http = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.http.interceptors.request.use(
      config => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        if (this.config.apiKey) {
          config.headers['X-API-Key'] = this.config.apiKey;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.http.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && this.config.onTokenExpired) {
          this.config.onTokenExpired();
        }
        if (this.config.onError) {
          this.config.onError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = undefined;
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.http.request<T>(config);
    return response.data;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  connectSocket(): Socket {
    if (!this.socket) {
      this.socket = io(this.config.baseURL, {
        auth: {
          token: this.accessToken,
        },
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }

  getSocket(): Socket | undefined {
    return this.socket;
  }
}
