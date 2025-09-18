import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode = false;
  usuarioId: number | null = null;
  categories = ['Electrónicos', 'Muebles', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Otros'];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usuarioForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usuarioId = +id;
      this.loadProduct();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      lugarNacimiento: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      ciudad: ['', [Validators.required, Validators.minLength(2)]],
      movil: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      fecha: ['', Validators.required],
      firma: ['', Validators.required],
      bloque1: [''],
      bloque2: [''],
    });
  }

  private loadProduct(): void {
    if (this.usuarioId) {
      const Usuario = this.usuarioService.getUsuarioById(this.usuarioId);
      if (Usuario) {
        this.usuarioForm.patchValue({
          id: Usuario.id,
          nombre: Usuario.nombre,
          lugarNacimiento: Usuario.lugarNacimiento,
          dni: Usuario.dni,
          correo: Usuario.correo,
          direccion: Usuario.direccion,
          cp: Usuario.cp,
          ciudad: Usuario.ciudad,
          movil: Usuario.movil,
          fecha: Usuario.fecha,
          firma: Usuario.firma,
          bloque1: Usuario.bloque1,
          bloque2: Usuario.bloque2,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      
      if (this.isEditMode && this.usuarioId) {
        // Actualizar producto existente
        const updatedProduct = this.usuarioService.updateUsuario(this.usuarioId, formValue);
        if (updatedProduct) {
          alert('Usuario actualizado exitosamente');
          this.router.navigate(['/usuarios']);
        } else {
          alert('Error al actualizar el Usuario');
        }
      } else {
        // Crear nuevo producto
        const newProduct = this.usuarioService.createUsuario(formValue);
        alert('Usuario creado exitosamente');
        this.router.navigate(['/usuarios']);
      }
    } else {
      this.markFormGroupTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  getFieldError(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      lugarNacimiento: 'Lugar de Nacimiento',
      dni: 'DNI',
      correo: 'Correo',
      direccion: 'Dirección',
      cp: 'Código Postal',
      ciudad: 'Ciudad',
      movil: 'Móvil',
      fecha: 'Fecha',
      firma: 'Firma',
      bloque1: 'Bloque 1',
      bloque2: 'Bloque 2'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
