import { Routes } from '@angular/router';

export const MATERIAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./list/list.component').then(c => c.ListComponent),
    },
    {
        path: 'inscribir',
        loadComponent: () =>
            import('./form/form.component').then(c => c.FormComponent),
    },
];