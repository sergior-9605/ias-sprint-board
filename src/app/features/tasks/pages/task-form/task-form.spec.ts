import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TaskForm } from './task-form';
import { TaskStore } from '../../state/task-store';
import { errorInterceptor } from '../../../../core/interceptors/error-interceptor';
import { MOCK_TASKS } from '../../../../../testing/mock-tasks';

function buildActivatedRoute(id: string | null = null) {
  return {
    snapshot: {
      paramMap: convertToParamMap(id ? { id } : {}),
    },
  };
}

/** Rellena todos los campos requeridos del formulario con valores válidos */
function fillValidForm(nativeEl: HTMLElement, future = '2026-12-31'): void {
  setValue(nativeEl, '#title', 'Tarea de integración de prueba');
  setValue(nativeEl, '#description', 'Descripción extensa de la tarea de integración para superar los 20 caracteres mínimos requeridos.');
  setValue(nativeEl, '#assignee', 'Tester QA');
  setValue(nativeEl, '#dueDate', future);
  setValue(nativeEl, '#tags', 'testing, integration');
}

function setValue(nativeEl: HTMLElement, selector: string, value: string): void {
  const el = nativeEl.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)!;
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
}

describe('TaskForm (Integration)', () => {
  let fixture: ComponentFixture<TaskForm>;
  let httpMock: HttpTestingController;
  let router: Router;
  let nativeEl: HTMLElement;

  async function setup(taskId: string | null = null) {
    await TestBed.configureTestingModule({
      imports: [TaskForm],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: buildActivatedRoute(taskId) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  }

  afterEach(() => httpMock.verify());

  it('debería crear el componente en modo creación', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance['isEditMode']).toBeFalse();
  });

  it('muestra el título "Nueva tarea" en modo creación', async () => {
    await setup();
    const h1: HTMLElement = nativeEl.querySelector('h1')!;
    expect(h1.textContent?.trim()).toBe('Nueva tarea');
  });

  it('el formulario comienza inválido con campos requeridos vacíos', async () => {
    await setup();
    expect(fixture.componentInstance['form'].invalid).toBeTrue();
  });

  it('marcar todos los campos como touched al intentar enviar un form inválido', async () => {
    await setup();
    const submitBtn: HTMLButtonElement = nativeEl.querySelector('button[type="submit"]')!;
    submitBtn.click();
    fixture.detectChanges();

    const alertMessages = nativeEl.querySelectorAll('[role="alert"]');
    expect(alertMessages.length).toBeGreaterThan(0);
  });

  it('no realiza petición HTTP cuando el formulario es inválido', async () => {
    await setup();
    const submitBtn: HTMLButtonElement = nativeEl.querySelector('button[type="submit"]')!;
    submitBtn.click();
    httpMock.expectNone('/api/tasks');
  });

  it('envía POST a /api/tasks con los datos correctos al hacer submit válido', async () => {
    await setup();
    fillValidForm(nativeEl);
    fixture.detectChanges();

    nativeEl.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Tarea de integración de prueba');
    expect(req.request.body.assignee).toBe('Tester QA');
    req.flush({ ...req.request.body, id: 'TASK-113', createdAt: '', updatedAt: '' });
  });

  it('navega a /tasks tras crear la tarea exitosamente', async () => {
    await setup();
    spyOn(router, 'navigate');
    fillValidForm(nativeEl);
    fixture.detectChanges();

    nativeEl.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    const req = httpMock.expectOne('/api/tasks');
    req.flush({ ...req.request.body, id: 'TASK-113', createdAt: '', updatedAt: '' });

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('las etiquetas se procesan como array único desde la cadena separada por comas', async () => {
    await setup();
    fillValidForm(nativeEl);
    fixture.detectChanges();

    nativeEl.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.body.tags).toEqual(['testing', 'integration']);
    req.flush({ ...req.request.body, id: 'TASK-113', createdAt: '', updatedAt: '' });
  });

  it('recorta espacios en blanco del título y asignado en toTaskInput()', async () => {
    await setup();
    setValue(nativeEl, '#title', '  Tarea con espacios  ');
    setValue(nativeEl, '#description', '  Descripción larga con espacios que supera los 20 caracteres  ');
    setValue(nativeEl, '#assignee', '  Ana Torres  ');
    setValue(nativeEl, '#dueDate', '2026-12-31');
    fixture.detectChanges();

    nativeEl.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.body.title).toBe('Tarea con espacios');
    expect(req.request.body.assignee).toBe('Ana Torres');
    req.flush({ ...req.request.body, id: 'TASK-113', createdAt: '', updatedAt: '' });
  });

  it('muestra error de validación cuando la fecha límite es pasada', async () => {
    await setup();
    setValue(nativeEl, '#dueDate', '2020-01-01');
    nativeEl.querySelector<HTMLInputElement>('#dueDate')!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const touchedControl = fixture.componentInstance['form'].controls.dueDate;
    touchedControl.markAsTouched();
    fixture.detectChanges();

    const dateErrors = touchedControl.errors;
    expect(dateErrors?.['pastDate']).toBeTrue();
  });

  it('debería crear el componente en modo edición cuando existe taskId en la ruta', async () => {
    await setup('TASK-101');
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS); // store.load() al inicializar en edit mode
    fixture.detectChanges();

    expect(fixture.componentInstance['isEditMode']).toBeTrue();
    expect(fixture.componentInstance['taskId']).toBe('TASK-101');
  });

  it('muestra el título "Editar tarea" en modo edición', async () => {
    await setup('TASK-101');
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    const h1: HTMLElement = nativeEl.querySelector('h1')!;
    expect(h1.textContent?.trim()).toBe('Editar tarea');
  });

  it('envía PUT a /api/tasks/:id al hacer submit en modo edición', async () => {
    await setup('TASK-101');
    httpMock.expectOne('/api/tasks').flush(MOCK_TASKS);
    fixture.detectChanges();

    // Marcar el formulario como dirty para que el effect pre-rellene
    const form = fixture.componentInstance['form'];
    form.patchValue({ title: 'Título editado correctamente', dueDate: '2026-12-31' });
    form.markAsDirty();
    fixture.detectChanges();

    nativeEl.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    const req = httpMock.expectOne('/api/tasks/TASK-101');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...MOCK_TASKS[0], title: 'Título editado correctamente' });
  });
});
