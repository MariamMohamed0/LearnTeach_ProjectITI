// import { environment } from "../../../environments/environment";


// const API_BASE_URL = environment.apiUrl;

// export class ApiClient {
//   private baseUrl: string = API_BASE_URL;

//   private getAuthToken(): string | null {
//     return localStorage.getItem('token');
//   }

// private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//   const token = this.getAuthToken();
//   const headers: any = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const response = await fetch(`${this.baseUrl}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'An error occurred' }));
//     throw new Error(error.message || 'Request failed');
//   }

//   return response.json();
// }

//   get<T>(endpoint: string) {
//     return this.request<T>(endpoint, { method: 'GET' });
//   }

//   post<T>(endpoint: string, data?: any) {
//     return this.request<T>(endpoint, {
//       method: 'POST',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   put<T>(endpoint: string, data?: any) {
//     return this.request<T>(endpoint, {
//       method: 'PUT',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   delete<T>(endpoint: string) {
//     return this.request<T>(endpoint, { method: 'DELETE' });
//   }
// }

// export const apiClient = new ApiClient();
 

import { environment } from "../../../environments/environment";

const API_BASE_URL = environment.apiUrl;

export class ApiClient {
  private baseUrl: string = API_BASE_URL;

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Error handling
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("Content-Type");

    // no content (204)
    if (response.status === 204 || !contentType) {
      return undefined as T;
    }

    // non-JSON (text)
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return text as unknown as T;
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

