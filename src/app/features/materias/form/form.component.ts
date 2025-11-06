import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MateriaService } from '../../../services/materia.service';
import { Materia } from '../../../interfaces/materias.interface';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  materiasForm: FormGroup;
  isEditMode = false;
  materiaId: string | null = null;
  materiasDisponibles: string[] = ['Matemáticas', 'Física', 'Programación', 'Historia', 'Inglés'];
  modalidades: string[] = ['Presencial', 'Virtual', 'Híbrida'];

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.materiasForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.materiaId = id;
      this.loadMateria();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', Validators.required],
      details: ['', Validators.required],
      materia: ['', Validators.required],
      semestre: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  private loadMateria(): void {
    if (this.materiaId) {
      const materia = this.materiaService.getMateriaById(this.materiaId);
      if (materia) {
        this.materiasForm.patchValue({
          codigo: materia.codigo,
          name: materia.name,
          details: materia.details,
          materia: materia.materia,
          semestre: materia.semestre,
        });
      } else {
        alert('Materia no encontrada');
        this.router.navigate(['/materias']);
      }
    }
  }

  onSubmit(): void {
    if (this.materiasForm.valid) {
      const formValue = this.materiasForm.value;
      
      if (this.isEditMode && this.materiaId) {
        // Actualizar materia existente
        const updatedMateria = this.materiaService.updateMateria(this.materiaId, formValue);
        if (updatedMateria) {
          alert('Materia actualizada exitosamente');
          this.router.navigate(['/materias']);
        } else {
          alert('Error al actualizar la materia');
        }
      } else {
        // Crear nueva materia
        const newMateria = this.materiaService.createMateria(formValue);
        alert('Materia creada exitosamente');
        this.router.navigate(['/materias']);
      }
    } else {
      this.markFormGroupTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.materiasForm.controls).forEach(key => {
      const control = this.materiasForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/materias']);
  }

  getFieldError(fieldName: string): string {
    const field = this.materiasForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return `${this.getFieldLabel(fieldName)} debe ser un número válido`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      codigo: 'Código',
      name: 'Nombre',
      details: 'Descripción',
      materia: 'Materia',
      semestre: 'Semestre'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.materiasForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Editar Materia' : 'Inscripción de Materia';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Actualizar' : 'Inscribirse';
  }
}
