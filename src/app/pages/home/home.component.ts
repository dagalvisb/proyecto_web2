import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CursoService } from '../../services/curso.service';
import { MateriaService } from '../../services/materia.service';
import { UsuarioService } from '../../services/usuario.service';
import { IncmateriasService } from '../../services/incmaterias.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  totalCursos = 0;
  totalMaterias = 0;
  totalUsuarios = 0;
  totalIncripciones = 0;
  private subs: Subscription[] = [];

  constructor(
    private cursoService: CursoService,
    private materiaService: MateriaService,
    private usuarioService: UsuarioService,
    private incmateriasService: IncmateriasService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.cursoService.getCursos().subscribe(c => this.totalCursos = c.length),
      this.materiaService.getMaterias().subscribe(m => this.totalMaterias = m.length),
      this.usuarioService.getUsuarios().subscribe(u => this.totalUsuarios = u.length),
      this.incmateriasService.getIncMaterias().subscribe(i => this.totalIncripciones = i.length)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
