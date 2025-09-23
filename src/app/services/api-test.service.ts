import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  constructor(private http: HttpClient) {}

  // Probar conexión con el backend
  testConnection(): Observable<{ connected: boolean; message: string }> {
    return this.http.get(`${API_CONFIG.baseUrl}/Usuarios`, {
      headers: API_CONFIG.headers
    }).pipe(
      map(() => ({
        connected: true,
        message: 'Conexión exitosa con el backend'
      })),
      catchError(error => {
        console.error('Error de conexión:', error);
        return of({
          connected: false,
          message: `Error de conexión: ${error.message || 'No se pudo conectar con el servidor'}`
        });
      })
    );
  }

  // Probar endpoint específico
  testUsuariosEndpoint(): Observable<{ success: boolean; count: number; message: string }> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}/Usuarios`, {
      headers: API_CONFIG.headers
    }).pipe(
      map((Usuarios) => ({
        success: true,
        count: Usuarios.length,
        message: `Se encontraron ${Usuarios.length} Usuarios`
      })),
      catchError(error => {
        console.error('Error en endpoint de Usuarios:', error);
        return of({
          success: false,
          count: 0,
          message: `Error en endpoint: ${error.message || 'Error desconocido'}`
        });
      })
    );
  }
}