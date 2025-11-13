import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IncMateria } from '../../../interfaces/incmaterias.interface';
import { IncmateriasService } from '../../../services/incmaterias.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  materias: string[] = []; 
  estudiantes: string[] = [];
  profesores: string[] = []; 
  incMaterias: IncMateria[] = [];
  filteredIncMaterias: IncMateria[] = [];
  searchQuery: string = '';
  searchMateria: string = '';
  loading = false;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private incMateriaService: IncmateriasService) {}

  


  ngOnInit(): void {
    // Suscribirse a los incMaterias
    this.subscription.add(
      this.incMateriaService.getIncMaterias().subscribe(incMaterias => {
        this.incMaterias = incMaterias;
        this.filteredIncMaterias = incMaterias;
        this.cargarMateriasUnicas();
      })
    );

    // Suscribirse al estado de carga
    this.subscription.add(
      this.incMateriaService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Suscribirse a los errores
    this.subscription.add(
      this.incMateriaService.error$.subscribe(error => {
        this.error = error;
      })
    );
  } 

  cargarEstudiantes(): void{
    this.incMateriaService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
      },
      error: (err) => {
        console.error('Error al obtener los estuaintes', err)
      }
    });
  }

  cargarProfesores(): void{
    this.incMateriaService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data;
      },
      error: (err) => {
        console.error('Error al obtener los profesores', err)
      }
    });
  }

  cargarMateriasUnicas(): void {
    this.incMateriaService.getMateriasUnicas().subscribe({
      next: (data) => {
        this.materias = data;
        console.log('Materias cargadas:', this.materias);
      },
      error: (err) => {
        console.error('Error al obtener las materias únicas', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredIncMaterias = this.incMateriaService.searchIncMaterias(this.searchQuery);
    } else {
      this.filteredIncMaterias = this.incMaterias;
    }
  }

  onSearch2(): void {
    if (this.searchMateria.trim()) {
      this.filteredIncMaterias = this.incMateriaService.searchIncMaterias(this.searchMateria);
    } else {
      this.filteredIncMaterias = this.incMaterias;
    }
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.filteredIncMaterias = this.incMaterias;
  }

  onDeleteIncMateria(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta inscripción?')) {
      this.incMateriaService.deleteIncMateria(id).subscribe({
        next: () => {
          alert('Inscripción eliminada exitosamente');
        },
        error: (error) => {
          alert(`Error al eliminar la inscripción: ${error.message}`);
        }
      });
    }
  }
  /*onDeleteIncMateria(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este IncMateria?')) {
      const success = this.incMateriaService.deleteIncMateria(id);
      if (success) {
        alert('IncMateria eliminado exitosamente');
        // La lista se actualizará automáticamente gracias al BehaviorSubject
      } else {
        alert('Error al eliminar el IncMateria');
      }
    }
  }*/

  onRefresh(): void {
    this.incMateriaService.refreshIncMaterias();
  }

  onClearError(): void {
    this.incMateriaService.clearError();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(fecha: string): string {
  return fecha || "Sin fecha";
  }

  formatDate2(date: string | Date | null | undefined): string {
    if (!date) return 'Sin fecha'; // null o undefined

    const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return 'Fecha inválida'; // string no válido

    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(parsedDate);
  }
  getStockClass(stock: number): string {
    if (stock === 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    return 'text-success';
  }
}
