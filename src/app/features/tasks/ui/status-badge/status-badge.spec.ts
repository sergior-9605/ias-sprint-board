import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';
import { TaskStatus } from '../../domain/task.model';

describe('StatusBadge (Unit)', () => {
  let component: StatusBadge;
  let fixture: ComponentFixture<StatusBadge>;

  function setStatus(status: TaskStatus) {
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusBadge] }).compileComponents();
    fixture = TestBed.createComponent(StatusBadge);
  });

  it('debería crearse correctamente', () => {
    setStatus('todo');
    expect(component = fixture.componentInstance).toBeTruthy();
  });

  it('renderiza un elemento <span> en el DOM', () => {
    setStatus('todo');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('muestra "Por hacer" para el status "todo"', () => {
    setStatus('todo');
    expect(fixture.nativeElement.textContent.trim()).toBe('Por hacer');
  });

  it('muestra "En progreso" para el status "in-progress"', () => {
    setStatus('in-progress');
    expect(fixture.nativeElement.textContent.trim()).toBe('En progreso');
  });

  it('muestra "Bloqueada" para el status "blocked"', () => {
    setStatus('blocked');
    expect(fixture.nativeElement.textContent.trim()).toBe('Bloqueada');
  });

  it('muestra "Hecha" para el status "done"', () => {
    setStatus('done');
    expect(fixture.nativeElement.textContent.trim()).toBe('Hecha');
  });

  it('aplica clases slate para el status "todo"', () => {
    setStatus('todo');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-slate-100');
    expect(span.className).toContain('text-slate-600');
  });

  it('aplica clases indigo para el status "in-progress"', () => {
    setStatus('in-progress');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-indigo-50');
    expect(span.className).toContain('text-indigo-700');
  });

  it('aplica clases red para el status "blocked"', () => {
    setStatus('blocked');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-red-50');
    expect(span.className).toContain('text-red-700');
  });

  it('aplica clases emerald para el status "done"', () => {
    setStatus('done');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-emerald-50');
    expect(span.className).toContain('text-emerald-700');
  });

  it('actualiza la etiqueta cuando el input status cambia', () => {
    setStatus('todo');
    expect(fixture.nativeElement.textContent.trim()).toBe('Por hacer');

    setStatus('done');
    expect(fixture.nativeElement.textContent.trim()).toBe('Hecha');
  });

  it('actualiza las clases CSS cuando el input status cambia', () => {
    setStatus('blocked');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-red-50');

    setStatus('in-progress');
    expect(span.className).toContain('bg-indigo-50');
    expect(span.className).not.toContain('bg-red-50');
  });
});
