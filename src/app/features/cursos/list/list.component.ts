import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CursoService } from '../../../services/curso.service';
import { Curso } from '../../../interfaces/curso.interface';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  cursos: Curso[] = [];
  filteredCursos: Curso[] = [];
  searchQuery: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.subscription = this.cursoService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
      this.filteredCursos = cursos;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredCursos = this.cursoService.searchCursos(this.searchQuery);
    } else {
      this.filteredCursos = this.cursos;
    }
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.filteredCursos = this.cursos;
  }

  onDeleteCurso(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este curso?')) {
      const success = this.cursoService.deleteCurso(id);
      if (success) {
        alert('Curso eliminado exitosamente');
      } else {
        alert('Error al eliminar el curso');
      }
    }
  }
}
