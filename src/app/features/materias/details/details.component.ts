import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Materia } from '../../../interfaces/materias.interface';
import { MateriaService } from '../../../services/materia.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  materia: Materia | undefined;
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = idParam;
      this.materia = this.materiaService.getMateriaById(this.id);
      
      if (!this.materia) {
        alert('Materia no encontrada');
        this.router.navigate(['/materias']);
      }
    }
  }

  onDeleteMateria(): void {
    if (this.materia && confirm('¿Está seguro de que desea eliminar esta materia?')) {
      const success = this.materiaService.deleteMateria(this.materia.id);
      if (success) {
        alert('Materia eliminada exitosamente');
        this.router.navigate(['/materias']);
      } else {
        alert('Error al eliminar la materia');
      }
    }
  }

  getSemestreLabel(semestre: string): string {
    return `${semestre}° Semestre`;
  }

  getCodigoFormatted(codigo: string): string {
    return codigo.toUpperCase();
  }
}
