import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  tiposUsuarios = ['Estudiante', 'Profesor'];
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery: string = '';
  searchTipoUsuario: string = '';
  loading = false;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // Suscribirse a los usuarios
    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(usuarios => {
        this.usuarios = usuarios;
        this.filteredUsuarios = usuarios;
      })
    );

    // Suscribirse al estado de carga
    this.subscription.add(
      this.usuarioService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Suscribirse a los errores
    this.subscription.add(
      this.usuarioService.error$.subscribe(error => {
        this.error = error;
      })
    );
  } 

  /*ngOnInit(): void {
    this.subscription = this.usuarioService.getUsuario().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.filteredUsuarios = usuarios;
    });
  }*/

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredUsuarios = this.usuarioService.searchUsuarios(this.searchQuery);
    } else {
      this.filteredUsuarios = this.usuarios;
    }
  }

  onSearch2(): void {
    if (this.searchTipoUsuario.trim()) {
      this.filteredUsuarios = this.usuarioService.searchUsuarios(this.searchTipoUsuario);
    } else {
      this.filteredUsuarios = this.usuarios;
    }
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.searchTipoUsuario = '';
    this.filteredUsuarios = this.usuarios;
  }

  onDeleteUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
        },
        error: (error) => {
          alert(`Error al eliminar el producto: ${error.message}`);
        }
      });
    }
  }
  /*onDeleteUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este Usuario?')) {
      const success = this.usuarioService.deleteUsuario(id);
      if (success) {
        alert('Usuario eliminado exitosamente');
        // La lista se actualizará automáticamente gracias al BehaviorSubject
      } else {
        alert('Error al eliminar el Usuario');
      }
    }
  }*/

  onRefresh(): void {
    this.usuarioService.refreshUsuarios();
  }

  onClearError(): void {
    this.usuarioService.clearError();
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
