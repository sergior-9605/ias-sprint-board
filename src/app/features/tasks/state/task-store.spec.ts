import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskApi } from '../data-access/task-api';
import { TaskStore } from './task-store';
import { SprintTask, TaskInput } from '../domain/task.model';
import { MOCK_TASKS, MOCK_SUMMARY } from '../../../../testing/mock-tasks';

describe('TaskStore (Unit)', () => {
  let store: TaskStore;
  let mockApi: jasmine.SpyObj<TaskApi>;

  beforeEach(() => {
    mockApi = jasmine.createSpyObj<TaskApi>('TaskApi', [
      'getTasks',
      'getTaskById',
      'createTask',
      'updateTask',
    ]);

    TestBed.configureTestingModule({
      providers: [TaskStore, { provide: TaskApi, useValue: mockApi }],
    });

    store = TestBed.inject(TaskStore);
  });

  it('debería crearse correctamente', () => {
    expect(store).toBeTruthy();
  });

  it('estado inicial: tasks vacío, loading false, error null y filtros en "all"', () => {
    expect(store.tasks()).toEqual([]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
    expect(store.search()).toBe('');
    expect(store.status()).toBe('all');
    expect(store.priority()).toBe('all');
    expect(store.selectedId()).toBeNull();
  });

  it('setSearch() actualiza el signal search', () => {
    store.setSearch('Ana Torres');
    expect(store.search()).toBe('Ana Torres');
  });

  it('setStatus() actualiza el signal status', () => {
    store.setStatus('in-progress');
    expect(store.status()).toBe('in-progress');
  });

  it('setPriority() actualiza el signal priority', () => {
    store.setPriority('critical');
    expect(store.priority()).toBe('critical');
  });

  it('clearFilters() restablece search, status y priority a sus valores por defecto', () => {
    store.setSearch('test');
    store.setStatus('done');
    store.setPriority('high');

    store.clearFilters();

    expect(store.search()).toBe('');
    expect(store.status()).toBe('all');
    expect(store.priority()).toBe('all');
  });

  it('select() actualiza selectedId; selectedTask() retorna la tarea correspondiente', () => {
    mockApi.getTasks.and.returnValue(of(MOCK_TASKS));
    store.load();

    store.select('TASK-103');
    expect(store.selectedId()).toBe('TASK-103');
    expect(store.selectedTask()?.id).toBe('TASK-103');
    expect(store.selectedTask()?.title).toBe('Definir el store con signals');
  });

  it('load() carga las 12 tareas desde la API y resetea loading a false', () => {
    mockApi.getTasks.and.returnValue(of(MOCK_TASKS));

    store.load();

    expect(store.tasks().length).toBe(12);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('load() establece el mensaje de error cuando la API falla', () => {
    mockApi.getTasks.and.returnValue(throwError(() => new Error('Fallo de conexión')));

    store.load();

    expect(store.error()).toBe('Fallo de conexión');
    expect(store.tasks()).toEqual([]);
  });

  it('filteredTasks() filtra por término de búsqueda en título y asignado', () => {
    mockApi.getTasks.and.returnValue(of(MOCK_TASKS));
    store.load();

    store.setSearch('Ana Torres');
    const byAssignee = store.filteredTasks();
    expect(byAssignee.every((t) => t.assignee === 'Ana Torres')).toBeTrue();

    store.setSearch('signals');
    const byTitle = store.filteredTasks();
    expect(byTitle.length).toBe(1);
    expect(byTitle[0].id).toBe('TASK-103');
  });

  it('filteredTasks() filtra por status y por priority de forma independiente', () => {
    mockApi.getTasks.and.returnValue(of(MOCK_TASKS));
    store.load();

    store.setStatus('done');
    expect(store.filteredTasks().every((t) => t.status === 'done')).toBeTrue();
    expect(store.filteredTasks().length).toBe(MOCK_SUMMARY.done);

    store.clearFilters();
    store.setPriority('critical');
    expect(store.filteredTasks().every((t) => t.priority === 'critical')).toBeTrue();
  });

  it('summary() calcula correctamente total, done, blocked, open y progress', () => {
    mockApi.getTasks.and.returnValue(of(MOCK_TASKS));
    store.load();

    const s = store.summary();
    expect(s.total).toBe(MOCK_SUMMARY.total);
    expect(s.done).toBe(MOCK_SUMMARY.done);
    expect(s.blocked).toBe(MOCK_SUMMARY.blocked);
    expect(s.open).toBe(MOCK_SUMMARY.open);
    expect(s.progress).toBe(MOCK_SUMMARY.progress);
  });

  it('create() agrega la nueva tarea al store y devuelve Observable<SprintTask>', () => {
    const input: TaskInput = {
      title: 'Tarea nueva', description: 'Descripción de la tarea nueva',
      status: 'todo', priority: 'low', assignee: 'Test', dueDate: '2026-12-31', tags: [],
    };
    const created: SprintTask = {
      ...input, id: 'TASK-113',
      createdAt: '2026-06-04T00:00:00.000Z',
      updatedAt: '2026-06-04T00:00:00.000Z',
    };
    mockApi.createTask.and.returnValue(of(created));

    let returned: SprintTask | undefined;
    store.create(input).subscribe((t) => (returned = t));

    expect(mockApi.createTask).toHaveBeenCalledWith(input);
    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].id).toBe('TASK-113');
    expect(returned?.id).toBe('TASK-113');
  });
});
