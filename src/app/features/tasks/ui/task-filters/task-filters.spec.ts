import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFilters } from './task-filters';

describe('TaskFilters (Unit)', () => {
  let fixture: ComponentFixture<TaskFilters>;
  let component: TaskFilters;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskFilters] }).compileComponents();
    fixture = TestBed.createComponent(TaskFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el input de búsqueda con id "search"', () => {
    const input = nativeEl = fixture.nativeElement;
    expect(input.querySelector('#search')).toBeTruthy();
  });

  it('renderiza el select de estado con id "status"', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
    expect(select).toBeTruthy();
  });

  it('renderiza el select de prioridad con id "priority"', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#priority');
    expect(select).toBeTruthy();
  });

  it('el select de status tiene la opción "all" más 4 estados', () => {
    const options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('#status option');
    expect(options.length).toBe(5);
    expect(options[0].value).toBe('all');
  });

  it('el select de priority tiene la opción "all" más 4 prioridades', () => {
    const options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('#priority option');
    expect(options.length).toBe(5);
    expect(options[0].value).toBe('all');
  });

  it('emite searchChange cuando el usuario escribe en el input de búsqueda', () => {
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#search');
    input.value = 'Ana Torres';
    input.dispatchEvent(new Event('input'));

    expect(spy).toHaveBeenCalledWith('Ana Torres');
  });

  it('emite statusChange cuando el usuario cambia el select de estado', () => {
    const spy = jasmine.createSpy('statusChange');
    component.statusChange.subscribe(spy);

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
    select.value = 'done';
    select.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith('done');
  });

  it('emite priorityChange cuando el usuario cambia el select de prioridad', () => {
    const spy = jasmine.createSpy('priorityChange');
    component.priorityChange.subscribe(spy);

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#priority');
    select.value = 'critical';
    select.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith('critical');
  });

  it('el input de búsqueda refleja el valor del signal search', () => {
    fixture.componentRef.setInput('search', 'Carlos Ruiz');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#search');
    expect(input.value).toBe('Carlos Ruiz');
  });

  it('el select de estado refleja el valor del signal status', () => {
    fixture.componentRef.setInput('status', 'blocked');
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
    expect(select.value).toBe('blocked');
  });

  it('el select de prioridad refleja el valor del signal priority', () => {
    fixture.componentRef.setInput('priority', 'high');
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#priority');
    expect(select.value).toBe('high');
  });
});
