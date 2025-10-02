import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  Usuario: Usuario | undefined;
  id: number = 0;
  loading = false;
  error: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

   ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadUsuario();
    }
  }

  private loadUsuario(): void {
    this.loading = true;
    this.error = null;
    
    this.usuarioService.getUsuarioById(this.id).subscribe({
      next: (usuario) => {
        this.Usuario = usuario;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error cargando usuario:', error);
      }
    });
  }

  /*ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.Usuario = this.usuarioService.getUsuarioById(this.id);
      
      if (!this.Usuario) {
        alert('Usuario no encontrado');
        this.router.navigate(['/usuarios']);
      }
    }
  }*/

    onDeleteUsuario(): void {
    if (this.Usuario && confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.loading = true;
      this.error = null;
      
      this.usuarioService.deleteUsuario(this.Usuario.id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          alert(`Error al eliminar el usuarioo: ${error.message}`);
        }
      });
    }
  }

  onClearError(): void {
    this.error = null;
  }

  /*onDeleteUsuario(): void {
    if (this.Usuario && confirm('¿Está seguro de que desea eliminar este usuario?')) {
      const success = this.usuarioService.deleteUsuario(this.Usuario.id);
      if (success) {
        alert('Usuario eliminado exitosamente');
        this.router.navigate(['/usuario']);
      } else {
        alert('Error al eliminar el usuario');
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
