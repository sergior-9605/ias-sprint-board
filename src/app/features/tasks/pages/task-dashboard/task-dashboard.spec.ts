import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TaskDashboard } from './task-dashboard';
import { TaskStore } from '../../state/task-store';
import { errorInterceptor } from '../../../../core/interceptors/error-interceptor';
import { MOCK_TASKS, MOCK_SUMMARY } from '../../../../../testing/mock-tasks';

describe('TaskDashboard (Integration)', () => {
  let fixture: ComponentFixture<TaskDashboard>;
  let httpMock: HttpTestingController;
  let store: TaskStore;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDashboard],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDashboard);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(TaskStore);
    nativeEl = fixture.nativeElement;
  });

  afterEach(() => httpMock.verify());

  it('debería crear el componente TaskDashboard', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('llama a store.load() en ngOnInit y envía la petición GET /api/tasks', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_TASKS);
  });

  it('muestra el esqueleto de carga mientras la petición está pendiente', () => {
    fixture.detectChanges();
    const skeleton = nativeEl.querySelector('.animate-pulse');
    expect(skeleton).toBeTruthy();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
  });

  it('muestra las 12 tarjetas de tarea tras recibir la respuesta', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    const cards = nativeEl.querySelectorAll('app-task-card');
    expect(cards.length).toBe(12);
  });

  it('muestra el resumen correcto: total, done, blocked en los contadores', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    const dds = nativeEl.querySelectorAll('dd');
    expect(dds[0].textContent?.trim()).toBe(String(MOCK_SUMMARY.total));
    expect(dds[3].textContent?.trim()).toBe(String(MOCK_SUMMARY.done));
    expect(dds[2].textContent?.trim()).toBe(String(MOCK_SUMMARY.blocked));
  });

  it('muestra el porcentaje de progreso correcto', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    const dds = nativeEl.querySelectorAll('dd');
    expect(dds[4].textContent?.trim()).toBe(`${MOCK_SUMMARY.progress}%`);
  });

  it('filtra las tareas por término de búsqueda al usar TaskFilters', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    store.setSearch('signals');
    fixture.detectChanges();

    const cards = nativeEl.querySelectorAll('app-task-card');
    expect(cards.length).toBe(1);
  });

  it('filtra las tareas por status "done" al usar TaskFilters', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    store.setStatus('done');
    fixture.detectChanges();

    const cards = nativeEl.querySelectorAll('app-task-card');
    expect(cards.length).toBe(MOCK_SUMMARY.done);
  });

  it('filtra las tareas por prioridad "critical" al usar TaskFilters', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    store.setPriority('critical');
    fixture.detectChanges();

    const criticalTasks = MOCK_TASKS.filter((t) => t.priority === 'critical');
    const cards = nativeEl.querySelectorAll('app-task-card');
    expect(cards.length).toBe(criticalTasks.length);
  });

  it('muestra el estado vacío cuando ninguna tarea coincide con los filtros', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    store.setSearch('xxxxxxxxxxx-no-existe');
    fixture.detectChanges();

    // Busca el texto en todo el contenido del componente, evitando el primer <p> del header
    expect(nativeEl.textContent).toContain('No hay tareas que coincidan');
  });

  it('muestra el estado de error con botón "Reintentar" cuando la API falla', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(null, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    // Requiere que load() use finalize() para resetear loading en error
    const alert = nativeEl.querySelector('[role="alert"]');
    expect(alert).withContext('El div role="alert" debe estar en el DOM cuando hay error').toBeTruthy();
    expect(nativeEl.textContent).toContain('Reintentar');
  });

  it('el enlace "+ Nueva tarea" apunta a /tasks/new', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    const newTaskLink: HTMLAnchorElement | null = nativeEl.querySelector('a[href="/tasks/new"]');
    expect(newTaskLink).toBeTruthy();
  });
});
