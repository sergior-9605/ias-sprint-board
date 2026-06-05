import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TaskCard } from './task-card';
import { StatusBadge } from '../status-badge/status-badge';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { SprintTask } from '../../domain/task.model';
import { MOCK_TASKS } from '../../../../../testing/mock-tasks';

describe('TaskCard (Unit)', () => {
  let fixture: ComponentFixture<TaskCard>;
  let nativeEl: HTMLElement;

  const setTask = (task: SprintTask) => {
    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    nativeEl = fixture.nativeElement;
  });

  it('debería crearse correctamente', () => {
    setTask(MOCK_TASKS[0]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza el título de la tarea en el DOM', () => {
    setTask(MOCK_TASKS[0]);
    expect(nativeEl.textContent).toContain('Crear layout del dashboard');
  });

  it('renderiza el nombre del asignado', () => {
    setTask(MOCK_TASKS[1]);
    expect(nativeEl.textContent).toContain('Carlos Ruiz');
  });

  it('renderiza la fecha límite de la tarea', () => {
    setTask(MOCK_TASKS[2]);
    expect(nativeEl.textContent).toContain(MOCK_TASKS[2].dueDate);
  });

  it('incluye un RouterLink hacia /tasks/:id', () => {
    setTask(MOCK_TASKS[0]);
    const link = nativeEl.querySelector('a[href="/tasks/TASK-101"]');
    expect(link).toBeTruthy();
  });

  it('aplica clase bg-slate-300 para prioridad "low"', () => {
    setTask(MOCK_TASKS[4]); // TASK-105 priority: low
    const dot = nativeEl.querySelector('.bg-slate-300');
    expect(dot).toBeTruthy();
  });

  it('aplica clase bg-amber-400 para prioridad "medium"', () => {
    setTask(MOCK_TASKS[2]); // TASK-103 priority: medium
    const dot = nativeEl.querySelector('.bg-amber-400');
    expect(dot).toBeTruthy();
  });

  it('aplica clase bg-orange-500 para prioridad "high"', () => {
    setTask(MOCK_TASKS[0]); // TASK-101 priority: high
    const dot = nativeEl.querySelector('.bg-orange-500');
    expect(dot).toBeTruthy();
  });

  it('aplica clase bg-red-500 para prioridad "critical"', () => {
    setTask(MOCK_TASKS[1]); // TASK-102 priority: critical
    const dot = nativeEl.querySelector('.bg-red-500');
    expect(dot).toBeTruthy();
  });

  it('renderiza el componente StatusBadge con el status correcto', () => {
    setTask(MOCK_TASKS[3]); // TASK-104 status: blocked
    const badge = fixture.debugElement.query(By.directive(StatusBadge));
    expect(badge).toBeTruthy();
    expect(nativeEl.textContent).toContain('Bloqueada');
  });

  it('renderiza el componente PriorityBadge con la prioridad correcta', () => {
    setTask(MOCK_TASKS[0]); // TASK-101 priority: high
    const badge = fixture.debugElement.query(By.directive(PriorityBadge));
    expect(badge).toBeTruthy();
    expect(nativeEl.textContent).toContain('Alta');
  });

  it('actualiza el contenido cuando el input task cambia', () => {
    setTask(MOCK_TASKS[0]);
    expect(nativeEl.textContent).toContain('Ana Torres');

    setTask(MOCK_TASKS[1]);
    expect(nativeEl.textContent).toContain('Carlos Ruiz');
    expect(nativeEl.textContent).not.toContain('Ana Torres');
  });
});
