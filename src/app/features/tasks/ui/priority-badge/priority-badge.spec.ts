import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityBadge } from './priority-badge';
import { TaskPriority } from '../../domain/task.model';

describe('PriorityBadge (Unit)', () => {
  let component: PriorityBadge;
  let fixture: ComponentFixture<PriorityBadge>;

  function setPriority(priority: TaskPriority) {
    fixture.componentRef.setInput('priority', priority);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PriorityBadge] }).compileComponents();
    fixture = TestBed.createComponent(PriorityBadge);
  });

  it('debería crearse correctamente', () => {
    setPriority('low');
    expect(component = fixture.componentInstance).toBeTruthy();
  });

  it('renderiza un elemento <span> en el DOM', () => {
    setPriority('low');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('muestra "Baja" para la prioridad "low"', () => {
    setPriority('low');
    expect(fixture.nativeElement.textContent.trim()).toBe('Baja');
  });

  it('muestra "Media" para la prioridad "medium"', () => {
    setPriority('medium');
    expect(fixture.nativeElement.textContent.trim()).toBe('Media');
  });

  it('muestra "Alta" para la prioridad "high"', () => {
    setPriority('high');
    expect(fixture.nativeElement.textContent.trim()).toBe('Alta');
  });

  it('muestra "Crítica" para la prioridad "critical"', () => {
    setPriority('critical');
    expect(fixture.nativeElement.textContent.trim()).toBe('Crítica');
  });

  it('aplica clases slate para la prioridad "low"', () => {
    setPriority('low');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-slate-100');
    expect(span.className).toContain('text-slate-600');
  });

  it('aplica clases amber para la prioridad "medium"', () => {
    setPriority('medium');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-amber-50');
    expect(span.className).toContain('text-amber-700');
  });

  it('aplica clases orange para la prioridad "high"', () => {
    setPriority('high');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-orange-50');
    expect(span.className).toContain('text-orange-700');
  });

  it('aplica clases red para la prioridad "critical"', () => {
    setPriority('critical');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-red-50');
    expect(span.className).toContain('text-red-700');
  });

  it('actualiza la etiqueta cuando el input priority cambia', () => {
    setPriority('low');
    expect(fixture.nativeElement.textContent.trim()).toBe('Baja');

    setPriority('critical');
    expect(fixture.nativeElement.textContent.trim()).toBe('Crítica');
  });

  it('actualiza las clases CSS cuando el input priority cambia', () => {
    setPriority('medium');
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-amber-50');

    setPriority('high');
    expect(span.className).toContain('bg-orange-50');
    expect(span.className).not.toContain('bg-amber-50');
  });
});
