import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskApi } from './task-api';
import { SprintTask, TaskInput } from '../domain/task.model';
import { MOCK_TASKS } from '../../../../testing/mock-tasks';

const MOCK_INPUT: TaskInput = {
  title: 'Nueva tarea de prueba',
  description: 'Descripción extensa para verificar que la nueva tarea se envía correctamente.',
  status: 'todo',
  priority: 'medium',
  assignee: 'Tester QA',
  dueDate: '2026-12-31',
  tags: ['testing'],
};

describe('TaskApi (Unit)', () => {
  let service: TaskApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getTasks() realiza GET a /api/tasks', () => {
    service.getTasks().subscribe();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_TASKS);
  });

  it('getTasks() retorna los 12 registros mockeados', () => {
    let result: SprintTask[] = [];
    service.getTasks().subscribe((tasks) => (result = tasks));
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    expect(result.length).toBe(12);
    expect(result[0].id).toBe('TASK-101');
    expect(result[11].id).toBe('TASK-112');
  });

  it('getTasks() propaga el error HTTP al suscriptor', () => {
    let captured: unknown;
    service.getTasks().subscribe({ error: (e) => (captured = e) });
    httpMock.expectOne('/api/tasks').error(new ProgressEvent('network error'));
    expect(captured).toBeDefined();
  });

  it('getTaskById() realiza GET a /api/tasks/:id con el id correcto', () => {
    service.getTaskById('TASK-103').subscribe();
    const req = httpMock.expectOne('/api/tasks/TASK-103');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_TASKS[2]);
  });

  it('getTaskById() retorna el SprintTask correspondiente al id', () => {
    let result: SprintTask | undefined;
    service.getTaskById('TASK-103').subscribe((t) => (result = t));
    httpMock.expectOne('/api/tasks/TASK-103').flush(MOCK_TASKS[2]);
    expect(result?.id).toBe('TASK-103');
    expect(result?.title).toBe('Definir el store con signals');
  });

  it('getTaskById() propaga un error 404 cuando la tarea no existe', () => {
    let captured: unknown;
    service.getTaskById('TASK-999').subscribe({ error: (e) => (captured = e) });
    httpMock.expectOne('/api/tasks/TASK-999').flush(null, { status: 404, statusText: 'Not Found' });
    expect(captured).toBeDefined();
  });

  it('createTask() realiza POST a /api/tasks con el body correcto', () => {
    service.createTask(MOCK_INPUT).subscribe();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_INPUT);
    req.flush({ ...MOCK_INPUT, id: 'TASK-113', createdAt: '2026-06-04T00:00:00.000Z', updatedAt: '2026-06-04T00:00:00.000Z' });
  });

  it('createTask() retorna el SprintTask creado con id generado', () => {
    let created: SprintTask | undefined;
    service.createTask(MOCK_INPUT).subscribe((t) => (created = t));
    httpMock.expectOne('/api/tasks').flush({
      ...MOCK_INPUT,
      id: 'TASK-113',
      createdAt: '2026-06-04T00:00:00.000Z',
      updatedAt: '2026-06-04T00:00:00.000Z',
    });
    expect(created?.id).toBe('TASK-113');
    expect(created?.title).toBe(MOCK_INPUT.title);
  });

  it('createTask() propaga el error HTTP al suscriptor', () => {
    let captured: unknown;
    service.createTask(MOCK_INPUT).subscribe({ error: (e) => (captured = e) });
    httpMock.expectOne('/api/tasks').flush(null, { status: 500, statusText: 'Internal Server Error' });
    expect(captured).toBeDefined();
  });

  it('updateTask() realiza PUT a /api/tasks/:id con el body correcto', () => {
    const updated = { ...MOCK_INPUT, title: 'Tarea actualizada', status: 'done' as const };
    service.updateTask('TASK-101', updated).subscribe();
    const req = httpMock.expectOne('/api/tasks/TASK-101');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush({ ...MOCK_TASKS[0], ...updated });
  });

  it('updateTask() retorna la tarea con los campos actualizados', () => {
    const updated = { ...MOCK_INPUT, title: 'Tarea lista', status: 'done' as const };
    let result: SprintTask | undefined;
    service.updateTask('TASK-101', updated).subscribe((t) => (result = t));
    httpMock.expectOne('/api/tasks/TASK-101').flush({ ...MOCK_TASKS[0], ...updated });
    expect(result?.title).toBe('Tarea lista');
    expect(result?.status).toBe('done');
  });
});
