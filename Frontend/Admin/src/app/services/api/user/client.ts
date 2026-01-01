// import { environment } from "../../../environments/environment";

import { environment } from "../../../../environments/environment";




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

//   // if (token) {
//   //   headers['Authorization'] = `Bearer ${token}`;
//   // }

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
class ApiClient {
  private baseUrl: string =`${environment.apiUrl}`;

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, isFormData = false): Promise<T> {
    const token = this.getAuthToken();

    const headers: any = {
      ...options.headers,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body = options.body && !isFormData ? JSON.stringify(options.body) : options.body;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, isFormData = false) {
    return this.request<T>(endpoint, { method: 'POST', body: data }, isFormData);
  }

  put<T>(endpoint: string, data?: any, isFormData = false) {
    return this.request<T>(endpoint, { method: 'PUT', body: data }, isFormData);
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
