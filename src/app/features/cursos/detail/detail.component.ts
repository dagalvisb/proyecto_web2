import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../interfaces/curso.interface';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  curso: Curso | undefined;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.curso = this.cursoService.getCursoById(this.id);

      if (!this.curso) {
        alert('Curso no encontrado');
        this.router.navigate(['/cursos']);
      }
    }
  }

  onDeleteCurso(): void {
    if (this.curso && confirm('¿Está seguro de que desea eliminar este curso?')) {
      const success = this.cursoService.deleteCurso(this.curso.id);
      if (success) {
        alert('Curso eliminado exitosamente');
        this.router.navigate(['/cursos']);
      } else {
        alert('Error al eliminar el curso');
      }
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getEstudiantesClass(cantidad: number): string {
    if (cantidad >= 30) return 'text-success fw-bold';
    if (cantidad >= 15) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  getEstudiantesStatus(cantidad: number): string {
    if (cantidad >= 30) return 'Grupo completo';
    if (cantidad >= 15) return 'Grupo moderado';
    return 'Grupo pequeño';
  }
}
