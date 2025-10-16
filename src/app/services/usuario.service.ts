import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuario.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUsuarios();
  }

  // Cargar todos los usuarioos desde la API
  private loadUsuarios(): void {
    this.setLoading(true);
    this.setError(null);
    
    this.apiService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuariosSubject.next(usuarios);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message);
        this.setLoading(false);
        console.error('Error cargando usuarioos:', error);
      }
    });
  }

  // Obtener todos los usuarioos
  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios$;
  }

  // Obtener un usuarioo por ID
  getUsuarioById(id: number): Observable<Usuario> {
     let obtenerUsuario: Observable<Usuario> = this.apiService.getUsuarioById(id).pipe(
      catchError(error => {
        this.setError(error.message);
        return throwError(() => error);
      })
    );
    console.log("Variable de obtenerUsuario", obtenerUsuario);
    return obtenerUsuario;
  }

  // Crear un nuevo usuarioo
  createUsuario(usuario: Omit<Usuario, 'id' | 'createdDate' | 'updatedDate'>): Observable<Usuario> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.createUsuario(usuario).pipe(
      tap(newUsuario => {
        // Actualizar la lista local con el nuevo usuarioo
        const currentUsuarios = this.usuariosSubject.value;
        this.usuariosSubject.next([...currentUsuarios, newUsuario]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError(error.message);
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // Actualizar un usuarioo existente
  updateUsuario(id: number, usuario: Partial<Omit<Usuario, 'id' | 'createdDate'>>): Observable<Usuario> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.updateUsuario(id, usuario).pipe(
      tap(updatedUsuario => {
        // Actualizar la lista local con el usuarioo actualizado
        const currentUsuarios = this.usuariosSubject.value;
        const index = currentUsuarios.findIndex(p => p.id === id);
        if (index !== -1) {
          currentUsuarios[index] = updatedUsuario;
          this.usuariosSubject.next([...currentUsuarios]);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError(error.message);
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // Eliminar un usuarioo
  deleteUsuario(id: number): Observable<boolean> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.deleteUsuario(id).pipe(
      tap(() => {
        // Remover el usuarioo de la lista local
        const currentUsuarios = this.usuariosSubject.value;
        const updatedUsuarios = currentUsuarios.filter(p => p.id !== id);
        this.usuariosSubject.next(updatedUsuarios);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError(error.message);
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // Buscar usuarioos por nombre o categoría (búsqueda local)
  searchUsuarios(query: string): Usuario[] {
    const usuarios = this.usuariosSubject.value;
    const lowercaseQuery = query.toLowerCase();
    
    return usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(lowercaseQuery) ||
      usuario.dni.toLowerCase().includes(lowercaseQuery) ||
      usuario.correo.toLowerCase().includes(lowercaseQuery) ||
      usuario.tipo_usuario.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Recargar usuarioos desde la API
  refreshUsuarios(): void {
    this.loadUsuarios();
  }

  // Obtener estado de carga
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  // Obtener último error
  getLastError(): string | null {
    return this.errorSubject.value;
  }

  // Limpiar error
  clearError(): void {
    this.setError(null);
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }
}
