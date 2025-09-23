import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuario.interface';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_CONFIG.baseUrl;
  private httpOptions = {
    headers: new HttpHeaders(API_CONFIG.headers)
  };

  constructor(private http: HttpClient) {}

  // GET /api/Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/Usuarios/listaUsuario`, this.httpOptions)
      .pipe(
        map(Usuarios => Usuarios.map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        }))),
        catchError(this.handleError)
      );
  }

  // GET /api/Usuarios/{id}
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuarios/verUsuario?id=${id}`, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // POST /api/Usuarios
  createUsuario(Usuario: Omit<Usuario, 'id' | 'createdDate' | 'updatedDate'>): Observable<Usuario> {
    const UsuarioToSend = {
      ...Usuario,
      id: 0, // El backend generará el ID
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    return this.http.post<Usuario>(`${this.baseUrl}/Usuarios/crearUsuario`, UsuarioToSend, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // PUT /api/Usuarios/{id}
  updateUsuario(id: number, Usuario: Partial<Omit<Usuario, 'id' | 'createdDate'>>): Observable<Usuario> {
    const UsuarioToSend = {
      ...Usuario,
      id: id,
      updatedDate: new Date().toISOString()
    };

    return this.http.put<Usuario>(`${this.baseUrl}/Usuarios/editarUsuario?id=${id}`, UsuarioToSend, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // DELETE /api/Usuarios/{id}
  deleteUsuario(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/Usuarios/eliminarUsuarios?id=${id}`, this.httpOptions)
      .pipe(
        map(() => true),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicie sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. No tiene permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 409:
          errorMessage = 'Conflicto. El recurso ya existe o está en uso.';
          break;
        case 422:
          errorMessage = 'Datos de entrada inválidos.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
      }
    }

    console.error('Error en API:', error);
    return throwError(() => new Error(errorMessage));
  }
}