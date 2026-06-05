import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';
import type { SprintTask, TaskInput } from '../../features/tasks/domain/task.model';

const LATENCY_MS = 600;

const tasks: SprintTask[] = [
  { id: 'TASK-101', title: 'Crear layout del dashboard', description: 'Definir estructura visual y navegación principal del tablero de sprint.', status: 'in-progress', priority: 'high', assignee: 'Ana Torres', dueDate: '2026-06-10', tags: ['ui', 'dashboard'], createdAt: '2026-06-01T09:00:00.000Z', updatedAt: '2026-06-02T15:20:00.000Z' },
  { id: 'TASK-102', title: 'Conectar servicio de tareas', description: 'Implementar la capa HTTP tipada con manejo de errores transversal.', status: 'todo', priority: 'critical', assignee: 'Carlos Ruiz', dueDate: '2026-06-08', tags: ['http', 'architecture'], createdAt: '2026-06-01T10:00:00.000Z', updatedAt: '2026-06-01T10:00:00.000Z' },
  { id: 'TASK-103', title: 'Definir el store con signals', description: 'Crear el store del feature con signals, computed para filtros y métricas.', status: 'done', priority: 'medium', assignee: 'Lucía Gómez', dueDate: '2026-06-05', tags: ['signals', 'state'], createdAt: '2026-05-30T08:00:00.000Z', updatedAt: '2026-06-03T11:45:00.000Z' },
  { id: 'TASK-104', title: 'Resolver bug de routing en detalle', description: 'El parámetro :id no se resuelve al recargar la vista de detalle de tarea.', status: 'blocked', priority: 'high', assignee: 'Diego Pérez', dueDate: '2026-06-12', tags: ['routing', 'bug'], createdAt: '2026-06-02T14:00:00.000Z', updatedAt: '2026-06-02T16:30:00.000Z' },
  { id: 'TASK-105', title: 'Escribir pruebas del formulario', description: 'Cubrir validadores, submit inválido, submit válido y mapeo al modelo de dominio.', status: 'todo', priority: 'low', assignee: 'María López', dueDate: '2026-06-15', tags: ['testing', 'forms'], createdAt: '2026-06-02T09:30:00.000Z', updatedAt: '2026-06-02T09:30:00.000Z' },
  { id: 'TASK-106', title: 'Configurar interceptor de errores', description: 'Mapear errores HTTP a mensajes claros sin exponer detalles técnicos al usuario.', status: 'in-progress', priority: 'medium', assignee: 'Andrés Vargas', dueDate: '2026-06-11', tags: ['http', 'errors'], createdAt: '2026-06-01T13:00:00.000Z', updatedAt: '2026-06-03T08:10:00.000Z' },
  { id: 'TASK-107', title: 'Documentar el README', description: 'Redactar instrucciones de instalación, ejecución, pruebas y decisiones técnicas.', status: 'done', priority: 'low', assignee: 'Ana Torres', dueDate: '2026-06-04', tags: ['docs'], createdAt: '2026-05-29T10:00:00.000Z', updatedAt: '2026-06-03T09:00:00.000Z' },
];

function generateId(): string {
  const maxNumber = tasks
    .map((task) => Number(task.id.replace('TASK-', '')))
    .filter((value) => !Number.isNaN(value))
    .reduce((max, value) => Math.max(max, value), 100);
  return `TASK-${maxNumber + 1}`;
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/tasks'))
    return next(req);

  const id = req.url.match(/\/api\/tasks\/(.+)$/)?.[1];

  if (req.method === 'GET' && !id)
    return of(new HttpResponse({ status: 200, body: structuredClone(tasks) })).pipe(delay(LATENCY_MS));

  if (req.method === 'GET' && id) {
    const found = tasks.find((task) => task.id === id);
    if (!found)
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    
    return of(new HttpResponse({ status: 200, body: structuredClone(found) })).pipe(delay(LATENCY_MS));
  }

  if (req.method === 'POST' && !id) {
    const input = req.body as TaskInput;
    const now = new Date().toISOString();
    const created: SprintTask = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    tasks.push(created);
    return of(new HttpResponse({ status: 201, body: structuredClone(created) })).pipe(delay(LATENCY_MS));
  }

  if (req.method === 'PUT' && id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1)
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    
    const input = req.body as TaskInput;
    const updated: SprintTask = { ...tasks[index], ...input, updatedAt: new Date().toISOString() };
    tasks[index] = updated;
    return of(new HttpResponse({ status: 200, body: structuredClone(updated) })).pipe(delay(LATENCY_MS));
  }

  return next(req);
};
