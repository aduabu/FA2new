/**
 * REF ERP Enterprise Platform — Centralized REST API Client
 * Single HTTP entry point for all frontend components.
 * Enforces standardized response contracts, error parsing, transient retries,
 * request correlation IDs, and telemetry events for Developer Diagnostics.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  errors?: any[];
  error_code?: string;
  request_id?: string;
  meta?: {
    timestamp: string;
    execution_ms: number;
    api_version: string;
  };
}

export interface TelemetryLog {
  id: string;
  requestId: string;
  method: string;
  url: string;
  status: number;
  executionMs: number;
  timestamp: string;
  success: boolean;
  errorCode?: string;
  payload?: any;
  response?: any;
}

class ApiClient {
  private maxRetries = 2;

  private generateRequestId(): string {
    return 'req_' + Math.random().toString(36).substring(2, 11);
  }

  private dispatchTelemetry(log: TelemetryLog): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api_telemetry', { detail: log }));
    }
  }

  public async request<T = any>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    const requestId = this.generateRequestId();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response | null = null;
    let responseText = '';
    let json: ApiResponse<T> | null = null;
    let executionMs = 0;

    try {
      response = await fetch(url, config);
      executionMs = Math.round(performance.now() - startTime);
      responseText = await response.text();

      // Check if response is valid JSON
      try {
        json = JSON.parse(responseText);
      } catch (e) {
        console.warn(`[ApiClient] Non-JSON response received from ${url}:`, responseText);
      }

      // Check for transient server failures (502, 503, 504) for automatic retry
      if (
        [502, 503, 504].includes(response.status) &&
        retryCount < this.maxRetries &&
        (options.method || 'GET') === 'GET'
      ) {
        console.warn(`[ApiClient] Transient server error ${response.status}. Retrying (${retryCount + 1}/${this.maxRetries})...`);
        await new Promise(r => setTimeout(r, 500 * (retryCount + 1)));
        return this.request<T>(url, options, retryCount + 1);
      }

      const isSuccess = response.ok && json !== null && json.success !== false;
      const responseRequestId = response.headers.get('X-Request-ID') || (json && json.request_id) || requestId;
      const errorCode = json?.error_code || (response.ok ? undefined : `HTTP_${response.status}`);

      let parsedPayload: any = undefined;
      if (options.body) {
        try {
          parsedPayload = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        } catch (e) {
          parsedPayload = options.body;
        }
      }

      const telemetryResponse = json !== null ? json : (responseText || {
        success: false,
        code: response.status,
        message: `HTTP ${response.status} Server Response`,
        request_id: responseRequestId,
        error_code: errorCode
      });

      // Dispatch telemetry event to Developer Diagnostics Bar
      this.dispatchTelemetry({
        id: Math.random().toString(36).substring(2, 9),
        requestId: responseRequestId,
        method: options.method || 'GET',
        url,
        status: response.status,
        executionMs,
        timestamp: new Date().toLocaleTimeString(),
        success: isSuccess,
        errorCode,
        payload: parsedPayload,
        response: telemetryResponse,
      });

      if (isSuccess && json) {
        return json;
      }

      // Format structured error response
      const errorMessage =
        (json && json.message) ||
        (response.status === 404 ? `Endpoint Route Not Found (${url})` :
         response.status === 401 ? 'Unauthorized Access' :
         response.status === 403 ? 'Permission Denied' :
         response.status === 409 ? 'Duplicate Reference Conflict' :
         response.status === 422 ? 'Validation Failed' :
         `Server returned HTTP ${response.status}`);

      return {
        success: false,
        code: response.status,
        message: `${errorMessage} (Request ID: ${responseRequestId})`,
        data: null as any,
        error_code: errorCode,
        request_id: responseRequestId,
        errors: json?.errors || [],
        meta: json?.meta || { timestamp: new Date().toISOString(), execution_ms: executionMs, api_version: 'v1' }
      };

    } catch (err: any) {
      executionMs = Math.round(performance.now() - startTime);
      console.error(`[ApiClient] Network connection failure on ${url}:`, err);

      const errorLog: TelemetryLog = {
        id: Math.random().toString(36).substring(2, 9),
        requestId,
        method: options.method || 'GET',
        url,
        status: 0,
        executionMs,
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        errorCode: 'NETWORK_ERROR',
        payload: options.body ? JSON.parse(options.body as string || '{}') : undefined,
        response: err.message,
      };

      this.dispatchTelemetry(errorLog);

      return {
        success: false,
        code: 0,
        message: `Network Error: ${err.message || 'Unable to communicate with REST API Gateway'} (Request ID: ${requestId})`,
        data: null as any,
        error_code: 'NETWORK_ERROR',
        request_id: requestId,
        errors: [err.message],
        meta: { timestamp: new Date().toISOString(), execution_ms: executionMs, api_version: 'v1' }
      };
    }
  }

  public get<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  public post<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public put<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public delete<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
