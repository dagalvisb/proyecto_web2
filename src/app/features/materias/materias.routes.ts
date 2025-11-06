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
    {
        path: 'form/:id',
        loadComponent: () =>
            import('./form/form.component').then(c => c.FormComponent),
    },
    {
        path: 'details/:id',
        loadComponent: () =>
            import('./details/details.component').then(c => c.DetailsComponent),
    },
];