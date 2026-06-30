import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'usuarios/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'usuarios/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'inscripciones/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'inscripciones/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'cursos/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'cursos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
