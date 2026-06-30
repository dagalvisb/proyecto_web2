import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IncMateria } from '../interfaces/incmaterias.interface';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IncmateriasService {
  private apiUrl = 'https://localhost:7248/api/IncMaterias'; // URL base de tu backend
  private incMateriasSubject = new BehaviorSubject<IncMateria[]>([]);
  public incMaterias$ = this.incMateriasSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.loadIncMaterias();
  }

  // Cargar todos los incMateria desde la API
  private loadIncMaterias(): void {
    this.setLoading(true);
    this.setError(null);
    
    this.apiService.getIncMaterias().subscribe({
      next: (incMaterias) => {
        this.incMateriasSubject.next(incMaterias);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message);
        this.setLoading(false);
        console.error('Error cargando inscripción:', error);
      }
    });
  }


  // Obtener todos los incMateriaos
  getIncMaterias(): Observable<IncMateria[]> {
    return this.incMaterias$;
  }

  // Obtener un incMateriao por ID
  getIncMateriaById(id: number): Observable<IncMateria> {
     let obtenerIncMateria: Observable<IncMateria> = this.apiService.getIncMateriaById(id).pipe(
      catchError(error => {
        this.setError(error.message);
        return throwError(() => error);
      })
    );
    console.log("Variable de obtenerIncMateria", obtenerIncMateria);
    return obtenerIncMateria;
  }

  // Crear un nuevo incMateriao
  createIncMateria(incMateria: Omit<IncMateria, 'id' | 'createdDate' | 'updatedDate'>): Observable<IncMateria> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.createIncMateria(incMateria).pipe(
      tap(newIncMateria => {
        // Actualizar la lista local con el nuevo incMateriao
        const currentIncMaterias = this.incMateriasSubject.value;
        this.incMateriasSubject.next([...currentIncMaterias, newIncMateria]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError(error.message);
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // Actualizar un incMateriao existente
  updateIncMateria(id: number, incMateria: Partial<Omit<IncMateria, 'id'>>): Observable<IncMateria> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.updateIncMateria(id, incMateria).pipe(
      tap(updatedIncMateria => {
        // Actualizar la lista local con el incMateriao actualizado
        const currentIncMaterias = this.incMateriasSubject.value;
        const index = currentIncMaterias.findIndex(p => Number(p.id) === id);
        if (index !== -1) {
          currentIncMaterias[index] = updatedIncMateria;
          this.incMateriasSubject.next([...currentIncMaterias]);
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

  // Eliminar un incMateriao
  deleteIncMateria(id: number): Observable<boolean> {
    this.setLoading(true);
    this.setError(null);

    return this.apiService.deleteIncMateria(id).pipe(
      tap(() => {
        // Remover el incMateriao de la lista local
        const currentIncMaterias = this.incMateriasSubject.value;
        const updatedIncMaterias = currentIncMaterias.filter(p => Number(p.id) !== id);
        this.incMateriasSubject.next(updatedIncMaterias);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError(error.message);
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // Buscar incMateriaos por nombre o categoría (búsqueda local)
  searchIncMaterias(query: string): IncMateria[] {
    const incMaterias = this.incMateriasSubject.value;
    const lowercaseQuery = query.toLowerCase();
    
    return incMaterias.filter(incMateria => 
      incMateria.usuario.toLowerCase().includes(lowercaseQuery) ||
      incMateria.materia.toLowerCase().includes(lowercaseQuery) 
    );
  }

  // Método para obtener materias únicas
  getMateriasUnicas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Unicas`);
  }

  getEstudiantes(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/listaUsuariosEstudiantes`)
  }

  getProfesores(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/listaUsuariosProfesores`)
  }

  // Recargar incMateriaos desde la API
  refreshIncMaterias(): void {
    this.loadIncMaterias();
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
