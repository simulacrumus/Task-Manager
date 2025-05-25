export interface ApiClient {
    get<T>(url: string, params?: Record<string, string>): Promise<T>
    post<T>(url: string, data?: any, params?: Record<string, string>): Promise<T>;
    put<T>(url: string, data?: any, params?: Record<string, string>): Promise<T>;
    patch<T>(url: string, data?: any, params?: Record<string, string>): Promise<T>;
    delete<T>(url: string, params?: Record<string, string>): Promise<T>;
}