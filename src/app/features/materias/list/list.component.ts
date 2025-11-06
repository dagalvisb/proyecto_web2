import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../interfaces/materias.interface';
import { MateriaService } from '../../../services/materia.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  materias: Materia[] = [];
  filteredMaterias: Materia[] = [];
  searchQuery: string = '';
  modalidades: string[] = ['Presencial', 'Virtual', 'Híbrida'];
  selectedModalidad: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private materiaService: MateriaService) {}

  ngOnInit(): void {
    this.subscription = this.materiaService.getMaterias().subscribe(materias => {
      this.materias = materias;
      this.filteredMaterias = materias;
    });
  }

  trackById(index: number, item: Materia): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredMaterias = this.materiaService.searchMaterias(this.searchQuery);
    } else {
      this.filteredMaterias = this.materias;
    }
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.filteredMaterias = this.materias;
  }

  onDeleteMateria(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta Materia?')) {
      const success = this.materiaService.deleteMateria(id);
      if (success) {
        alert('Materia eliminada exitosamente');
        // La lista se actualizará automáticamente gracias al BehaviorSubject
      } else {
        alert('Error al eliminar la Materia');
      }
    }
  }

}
