import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'tasks' 
    },
    { 
        path: 'tasks', 
        loadChildren: () => import('./features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES) 
    },
    { 
        path: '**', 
        loadComponent: () => import('./shared/ui/not-found/not-found').then((m) => m.NotFound) 
    },
];
