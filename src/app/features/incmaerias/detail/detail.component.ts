import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncMateria } from '../../../interfaces/incmaterias.interface';
import { IncmateriasService } from '../../../services/incmaterias.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  IncMateria: IncMateria | undefined;
  id: number = 0;
  loading = false;
  error: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private incMateriaService: IncmateriasService,
    private router: Router
  ) {}

   ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadIncMateria();
    }
  }

  private loadIncMateria(): void {
    this.loading = true;
    this.error = null;
    
    this.incMateriaService.getIncMateriaById(this.id).subscribe({
      next: (incMateria) => {
        this.IncMateria = incMateria;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error cargando incMateria:', error);
      }
    });
  }

  /*ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.IncMateria = this.incMateriaService.getIncMateriaById(this.id);
      
      if (!this.IncMateria) {
        alert('IncMateria no encontrado');
        this.router.navigate(['/incMaterias']);
      }
    }
  }*/

    onDeleteIncMateria(): void {
    if (this.IncMateria && confirm('¿Está seguro de que desea eliminar este incMateria?')) {
      this.loading = true;
      this.error = null;
      
      this.incMateriaService.deleteIncMateria(this.IncMateria.id).subscribe({
        next: () => {
          alert('IncMateria eliminada exitosamente');
          this.router.navigate(['/incMaterias']);
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          alert(`Error al eliminar el incMateria: ${error.message}`);
        }
      });
    }
  }

  onClearError(): void {
    this.error = null;
  }

  /*onDeleteIncMateria(): void {
    if (this.IncMateria && confirm('¿Está seguro de que desea eliminar este incMateria?')) {
      const success = this.incMateriaService.deleteIncMateria(this.IncMateria.id);
      if (success) {
        alert('IncMateria eliminado exitosamente');
        this.router.navigate(['/incMateria']);
      } else {
        alert('Error al eliminar el incMateria');
      }
    }
  }*/

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(fecha: string): string {
  return fecha || "Sin fecha";
}

  formatDate2(date: any): string {
  if (!date) return '';

    // Si la fecha viene sin segundos ni zona horaria, le agregamos ":00Z"
    let fixedDate = date;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(date)) {
        fixedDate = date + ":00Z";
      }

    const parsedDate = new Date(fixedDate);
      if (isNaN(parsedDate.getTime())) {
        return '';
      }

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

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return 'Stock bajo';
    return 'En stock';
  }
}
