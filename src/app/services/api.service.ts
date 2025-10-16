import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Materia } from '../interfaces/materias.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { IncMateria } from '../interfaces/incmaterias.interface';
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
    return this.http.get<Usuario[]>(`${this.baseUrl}/Usuarios/ListaUsuario`, this.httpOptions)
      .pipe(
        map(Usuarios => Usuarios.map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        }))),
        catchError(this.handleError)
      );
  }

  // GET /api/Materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.baseUrl}/Usuarios/ListaMateria`, this.httpOptions)
      .pipe(
        map(Materias => Materias.map(Materia => ({
          ...Materia,
          createdDate: new Date(Materia.createdDate),
          updatedDate: new Date(Materia.updatedDate)
        }))),
        catchError(this.handleError)
      );
  }

  // GET /api/IncMaterias
   getIncMaterias(): Observable<IncMateria[]> {
    return this.http.get<IncMateria[]>(`${this.baseUrl}/Usuarios/ListaIncMaterias`, this.httpOptions)
      .pipe(
        map(IncMaterias => IncMaterias.map(IncMateria => ({
          ...IncMateria,
          createdDate: new Date(IncMateria.createdDate)
         
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

  // GET /api/Materias/{id}
  getMateriaById(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.baseUrl}/Usuarios/verMateria?id=${id}`, this.httpOptions)
      .pipe(
        map(Materia => ({
          ...Materia,
          createdDate: new Date(Materia.createdDate),
          updatedDate: new Date(Materia.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // GET /api/IncMaterias/{id}
  getIncMateriaById(id: number): Observable<IncMateria> {
    return this.http.get<IncMateria>(`${this.baseUrl}/Usuarios/verincMaterias?id=${id}`, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate)
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

    console.log(UsuarioToSend);
    return this.http.post<Usuario>(`${this.baseUrl}/Usuarios/CrearUsuario`, UsuarioToSend, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          createdDate: new Date(Usuario.createdDate),
          updatedDate: new Date(Usuario.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // POST /api/Materias
  createMateria(Materia: Omit<Materia, 'id' | 'createdDate' | 'updatedDate'>): Observable<Materia> {
    const MateriaToSend = {
      ...Materia,
      id: 0, // El backend generará el ID
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    console.log(MateriaToSend);
    return this.http.post<Materia>(`${this.baseUrl}/Usuarios/CrearMateria`, MateriaToSend, this.httpOptions)
      .pipe(
        map(Materia => ({
          ...Materia,
          createdDate: new Date(Materia.createdDate),
          updatedDate: new Date(Materia.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // POST /api/IncMaterias
  createIncMateria(Usuario: Omit<IncMateria, 'id' | 'createdDate' >): Observable<IncMateria> {
    const IncMateriaToSend = {
      ...Usuario,
      id: 0, // El backend generará el ID
      createdDate: new Date().toISOString(),
    };

    console.log(IncMateriaToSend);
    return this.http.post<IncMateria>(`${this.baseUrl}/Usuarios/CrearUsuario`, IncMateriaToSend, this.httpOptions)
      .pipe(
        map(IncMateria => ({
          ...IncMateria,
          createdDate: new Date(IncMateria.createdDate),
        })),
        catchError(this.handleError)
      );
  }

  // PUT /api/Usuarios/{id}
  updateUsuario(id: number, Usuario: Partial<Omit<Usuario, 'id' | 'updatedDate'>>): Observable<Usuario> {
    const UsuarioToSend = {
      ...Usuario,
      id: id,
      updatedDate: new Date().toISOString()
    };

    console.log("Variable de Usuario", UsuarioToSend);

    return this.http.put<Usuario>(`${this.baseUrl}/Usuarios/EditarUsuario?id=${id}`, UsuarioToSend, this.httpOptions)
      .pipe(
        map(Usuario => ({
          ...Usuario,
          updatedDate: new Date(Usuario.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // PUT /api/Materias/{id}
  updateMateria(id: number, Materia: Partial<Omit<Materia, 'id' | 'updatedDate'>>): Observable<Materia> {
    const MateriaToSend = {
      ...Materia,
      id: id,
      updatedDate: new Date().toISOString()
    };

    console.log("Variable de Materia", MateriaToSend);

    return this.http.put<Materia>(`${this.baseUrl}/Usuarios/EditarMateria?id=${id}`, MateriaToSend, this.httpOptions)
      .pipe(
        map(Materia => ({
          ...Materia,
          updatedDate: new Date(Materia.updatedDate)
        })),
        catchError(this.handleError)
      );
  }

  // PUT /api/IncMaterias/{id}
  updateIncMateria(id: number, IncMateria: Partial<Omit<Usuario, 'id' >>): Observable<IncMateria> {
    const IncMateriaToSend = {
      ...IncMateria,
      id: id,
    };

    console.log("Variable de IncMateria", IncMateriaToSend);

    return this.http.put<IncMateria>(`${this.baseUrl}/Usuarios/EditarUsuario?id=${id}`, IncMateriaToSend, this.httpOptions)
      .pipe(
        map(IncMateria => ({
          ...IncMateria,
        })),
        catchError(this.handleError)
      );
  }

  // DELETE /api/Usuarios/{id}
  deleteUsuario(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/Usuarios/EliminarUsuario?id=${id}`, this.httpOptions)
      .pipe(
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteMateria(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/Usuarios/EliminarMateria?id=${id}`, this.httpOptions)
      .pipe(
        map(() => true),
        catchError(this.handleError)
      );
  }

  // DELETE /api/IncMaterias/{id}
  deleteIncMateria(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/Usuarios/EliminarIncMaterias?id=${id}`, this.httpOptions)
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