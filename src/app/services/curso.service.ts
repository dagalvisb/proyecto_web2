import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../interfaces/curso.interface';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private cursosSubject = new BehaviorSubject<Curso[]>(this.getInitialCursos());
  public cursos$ = this.cursosSubject.asObservable();

  constructor() {}

  private getInitialCursos(): Curso[] {
    return [
      {
        id: 1,
        nombre: 'Matemáticas I',
        numeroCurso: 'MAT-101',
        profesor: 'Dr. Juan Pérez',
        cantidadEstudiantes: 35,
        descripcion: 'Curso introductorio de matemáticas básicas',
        createdDate: new Date('2025-01-15'),
        updatedDate: new Date('2025-01-15')
      },
      {
        id: 2,
        nombre: 'Programación Java',
        numeroCurso: 'PROG-201',
        profesor: 'Ing. María García',
        cantidadEstudiantes: 28,
        descripcion: 'Fundamentos de programación orientada a objetos con Java',
        createdDate: new Date('2025-02-10'),
        updatedDate: new Date('2025-02-10')
      },
      {
        id: 3,
        nombre: 'Base de Datos',
        numeroCurso: 'BD-301',
        profesor: 'MSc. Carlos López',
        cantidadEstudiantes: 42,
        descripcion: 'Diseño y administración de bases de datos relacionales',
        createdDate: new Date('2025-03-05'),
        updatedDate: new Date('2025-03-05')
      },
      {
        id: 4,
        nombre: 'Redes de Computadoras',
        numeroCurso: 'RED-401',
        profesor: 'Ing. Ana Martínez',
        cantidadEstudiantes: 22,
        descripcion: 'Arquitectura y protocolos de redes de computadoras',
        createdDate: new Date('2025-03-20'),
        updatedDate: new Date('2025-03-20')
      },
      {
        id: 5,
        nombre: 'Inteligencia Artificial',
        numeroCurso: 'IA-501',
        profesor: 'Dr. Roberto Sánchez',
        cantidadEstudiantes: 18,
        descripcion: 'Introducción a técnicas de inteligencia artificial y machine learning',
        createdDate: new Date('2025-04-01'),
        updatedDate: new Date('2025-04-01')
      }
    ];
  }

  getCursos(): Observable<Curso[]> {
    return this.cursos$;
  }

  getCursoById(id: number): Curso | undefined {
    const cursos = this.cursosSubject.value;
    return cursos.find(curso => curso.id === id);
  }

  createCurso(curso: Omit<Curso, 'id' | 'createdDate' | 'updatedDate'>): Curso {
    const cursos = this.cursosSubject.value;
    const newCurso: Curso = {
      ...curso,
      id: this.generateId(),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    const updatedCursos = [...cursos, newCurso];
    this.cursosSubject.next(updatedCursos);
    return newCurso;
  }

  updateCurso(id: number, curso: Partial<Omit<Curso, 'id' | 'createdDate'>>): Curso | null {
    const cursos = this.cursosSubject.value;
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) {
      return null;
    }
    const updatedCurso: Curso = {
      ...cursos[index],
      ...curso,
      updatedDate: new Date()
    };
    const updatedCursos = [...cursos];
    updatedCursos[index] = updatedCurso;
    this.cursosSubject.next(updatedCursos);
    return updatedCurso;
  }

  deleteCurso(id: number): boolean {
    const cursos = this.cursosSubject.value;
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }
    const updatedCursos = cursos.filter(c => c.id !== id);
    this.cursosSubject.next(updatedCursos);
    return true;
  }

  private generateId(): number {
    const cursos = this.cursosSubject.value;
    return Math.max(...cursos.map(c => c.id), 0) + 1;
  }

  searchCursos(query: string): Curso[] {
    const cursos = this.cursosSubject.value;
    const lowercaseQuery = query.toLowerCase();
    return cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(lowercaseQuery) ||
      curso.numeroCurso.toLowerCase().includes(lowercaseQuery) ||
      curso.profesor.toLowerCase().includes(lowercaseQuery) ||
      curso.descripcion.toLowerCase().includes(lowercaseQuery)
    );
  }
}
