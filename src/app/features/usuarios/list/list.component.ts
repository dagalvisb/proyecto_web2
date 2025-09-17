import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuarui.interface';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.subscription = this.usuarioService.getUsuario().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.filteredUsuarios = usuarios;
    });
  }

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

  onClearSearch(): void {
    this.searchQuery = '';
    this.filteredUsuarios = this.usuarios;
  }

  onDeleteProduct(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este Usuario?')) {
      const success = this.usuarioService.deleteUsuario(id);
      if (success) {
        alert('Usuario eliminado exitosamente');
        // La lista se actualizará automáticamente gracias al BehaviorSubject
      } else {
        alert('Error al eliminar el Usuario');
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    return 'text-success';
  }
}
