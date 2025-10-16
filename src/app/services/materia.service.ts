import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Materia } from '../interfaces/materias.interface';

@Injectable({
    providedIn: 'root'
})
export class MateriaService {
    private materiasSubject = new BehaviorSubject<Materia[]>(this.getInitialMaterias());
    public materias$ = this.materiasSubject.asObservable();

    constructor() { }

    getInitialMaterias(): Materia[] {
        return [
            {
                id: 1,
                codigo: 'MAT101',
                name: 'Matemáticas I',
                details: 'Curso introductorio de matemáticas',
                semestre: '1',
                materia: 'Matemáticas',
                createdDate: new Date(),
                updatedDate: new Date()
            },
            {
                id: 2,
                codigo: 'MAT102',
                name: 'Matemáticas II',
                details: 'Curso avanzado de matemáticas',
                semestre: '2',
                materia: 'Matemáticas',
                createdDate: new Date(),
                updatedDate: new Date()
            },
            {
                id: 3,
                codigo: 'FIS101',
                name: 'Física I',
                details: 'Curso introductorio de física',
                semestre: '1',
                materia: 'Física',
                createdDate: new Date(),
                updatedDate: new Date()
            },
            {
                id: 4,
                codigo: 'FIS102',
                name: 'Física II',
                details: 'Curso avanzado de física',
                semestre: '2',
                materia: 'Física',
                createdDate: new Date(),
                updatedDate: new Date()
            }
            
        ];
    }
    getMateriasIdNombre(): Observable<{ id: number; name: string }[]> {
        return this.materias$.pipe(
            map((materias) =>
            materias.map((m) => ({
                id: m.id,
                name: m.name,
            }))
            )
        );
    }

    getMaterias(): Observable<Materia[]> {
        return this.materias$;
    }

    getMateriaById(id: number): Materia | undefined {
        const materias = this.materiasSubject.getValue();
        return materias.find(materia => materia.id === id);
    };

    updateMateria(id: number, materia: Partial<Omit<Materia, 'id'>>): Materia | null {
        const materias = this.materiasSubject.getValue();
        const index = materias.findIndex(materia => materia.id === id);

        if (index === -1) {
            return null;
        }

        const updatedMateria: Materia = {
            ...materias[index],
            ...materia,
            
        };

        const updatedMaterias = [...materias];
        updatedMaterias[index] = updatedMateria;
        this.materiasSubject.next(updatedMaterias);

        return updatedMateria;
    }

    // Eliminar una materia
    deleteMateria(id: number): boolean {
        const materias = this.materiasSubject.getValue();
        const index = materias.findIndex(m => m.id === id);

        if (index === -1) {
            return false;
        }

        const updatedMaterias = materias.filter(m => (m.id) !== id);
        this.materiasSubject.next(updatedMaterias);
        return true;
    }

    // Buscar materias por nombre, código o descripción
    searchMaterias(query: string): Materia[] {
        const materias = this.materiasSubject.getValue();
        const lowercaseQuery = query.toLowerCase();

        return materias.filter(materia => 
            materia.name.toLowerCase().includes(lowercaseQuery) ||
            materia.codigo.toLowerCase().includes(lowercaseQuery) ||
            materia.details.toLowerCase().includes(lowercaseQuery) ||
            materia.materia.toLowerCase().includes(lowercaseQuery)
        );
    }

}
