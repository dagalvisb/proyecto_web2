import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncmateriasService } from '../../../services/incmaterias.service';
import { UsuarioService } from '../../../services/usuario.service';

import { MateriaService } from '../../../services/materia.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
  
})
export class FormComponent implements OnInit {
  incMateriaForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  IncMateriaId: number | null = null;
  usuariosIdNombre: { id: number; nombre: string }[] = [];
  materiasIdNombre: { id: number; name: string; semestre: string}[] = [];
  usuarioSeleccionado: number | null = null;
  materiaSeleccionada: number | null = null;


  constructor(
    private UsuarioService: UsuarioService,
    private MateriaService: MateriaService,
    private fb: FormBuilder,
    private IncMateriasService: IncmateriasService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.incMateriaForm = this.createForm();
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.IncMateriaId = +id;
      this.loadIncMateria();
    }

    this.UsuarioService.getUsuariosIdNombre().subscribe((data) => {
      this.usuariosIdNombre = data;
    });

    this.MateriaService.getMateriasIdNombre().subscribe((data) => {
      this.materiasIdNombre = data;
    });


  }


  private createForm(): FormGroup {
    return this.fb.group({
      usuario: [''],
      materia: [''],
    });
  }

  private loadIncMateria(): void {
    if (this.IncMateriaId) {
      this.loading = true;
      this.error = null;
      
      this.IncMateriasService.getIncMateriaById(this.IncMateriaId).subscribe({
        next: (incMateria) => {
          this.incMateriaForm.patchValue({
            id: incMateria.id,
            usuario: incMateria.usuario,
            materia: incMateria.materia

          });
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          console.error('Error cargando inscripción:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.incMateriaForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      // 1️⃣ Copia de los valores del formulario
      const formValue = { ...this.incMateriaForm.value };


      if (this.isEditMode && this.IncMateriaId) {
        // Actualizar inscripcion existente
        this.IncMateriasService.updateIncMateria(this.IncMateriaId, formValue).subscribe({
          next: () => {
            alert('Inscripción actualizada exitosamente');
            this.router.navigate(['/inscripciiones']);
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
            alert(`Error al actualizar el usuario: ${error.message}`);
          }
        });
      } else {
        // Crear nuevo inscripcion
        this.IncMateriasService.createIncMateria(formValue).subscribe({
          next: () => {
            alert('Inscripción creada exitosamente');
            this.router.navigate(['/inscripciones']);
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
            alert(`Error al crear la inscripción: ${error.message}`);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
    }
  }


  private markFormGroupTouched(): void {
    Object.keys(this.incMateriaForm.controls).forEach(key => {
      const control = this.incMateriaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  getFieldError(fieldName: string): string {
    const field = this.incMateriaForm.get(fieldName);
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
      usuario: 'Usuario',
      materia: 'Materia',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.incMateriaForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onClearError(): void {
    this.error = null;
  }
}
