import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
    {
        path: '',
        title: 'Tablero de tareas',
        loadComponent: () => import('./pages/task-dashboard/task-dashboard').then((m) => m.TaskDashboard)
    },
    {
        path: 'new',
        title: 'Nueva tarea',
        loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm)
    },
    {
        path: ':id/edit',
        title: 'Editar tarea',
        loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm)
    },
    {
        path: ':id',
        title: 'Detalle de tarea',
        loadComponent: () => import('./pages/task-detail/task-detail').then((m) => m.TaskDetail)
    },
];