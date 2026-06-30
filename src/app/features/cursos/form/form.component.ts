import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../../services/curso.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  cursoForm: FormGroup;
  isEditMode = false;
  cursoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cursoForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cursoId = +id;
      this.loadCurso();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      numeroCurso: ['', [Validators.required, Validators.minLength(3)]],
      profesor: ['', [Validators.required, Validators.minLength(3)]],
      cantidadEstudiantes: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadCurso(): void {
    if (this.cursoId) {
      const curso = this.cursoService.getCursoById(this.cursoId);
      if (curso) {
        this.cursoForm.patchValue({
          nombre: curso.nombre,
          numeroCurso: curso.numeroCurso,
          profesor: curso.profesor,
          cantidadEstudiantes: curso.cantidadEstudiantes,
          descripcion: curso.descripcion
        });
      }
    }
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const formValue = this.cursoForm.value;

      if (this.isEditMode && this.cursoId) {
        const updatedCurso = this.cursoService.updateCurso(this.cursoId, formValue);
        if (updatedCurso) {
          alert('Curso actualizado exitosamente');
          this.router.navigate(['/cursos']);
        } else {
          alert('Error al actualizar el curso');
        }
      } else {
        this.cursoService.createCurso(formValue);
        alert('Curso creado exitosamente');
        this.router.navigate(['/cursos']);
      }
    } else {
      this.markFormGroupTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cursoForm.controls).forEach(key => {
      const control = this.cursoForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }

  getFieldError(fieldName: string): string {
    const field = this.cursoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min - 1}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      numeroCurso: 'Número de Curso',
      profesor: 'Profesor',
      cantidadEstudiantes: 'Cantidad de Estudiantes',
      descripcion: 'Descripción'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cursoForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
