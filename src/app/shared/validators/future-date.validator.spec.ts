import { FormControl } from '@angular/forms';
import { futureDateValidator } from './future-date.validator';

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('futureDateValidator', () => {
  let validate: ReturnType<typeof futureDateValidator>;

  beforeEach(() => {
    validate = futureDateValidator();
  });

  it('debería crearse como función validadora', () => {
    expect(validate).toBeInstanceOf(Function);
  });

  it('retorna null cuando el valor es null', () => {
    const control = new FormControl<string | null>(null);
    expect(validate(control)).toBeNull();
  });

  it('retorna null cuando el valor es cadena vacía', () => {
    const control = new FormControl('');
    expect(validate(control)).toBeNull();
  });

  it('retorna null para la fecha de hoy', () => {
    const today = addDays(0);
    const control = new FormControl(today);
    expect(validate(control)).toBeNull();
  });

  it('retorna null para mañana', () => {
    const tomorrow = addDays(1);
    const control = new FormControl(tomorrow);
    expect(validate(control)).toBeNull();
  });

  it('retorna null para una fecha 30 días en el futuro', () => {
    const future = addDays(30);
    const control = new FormControl(future);
    expect(validate(control)).toBeNull();
  });

  it('retorna null para una fecha 365 días en el futuro', () => {
    const farFuture = addDays(365);
    const control = new FormControl(farFuture);
    expect(validate(control)).toBeNull();
  });

  it('retorna { pastDate: true } para ayer', () => {
    const yesterday = addDays(-1);
    const control = new FormControl(yesterday);
    expect(validate(control)).toEqual({ pastDate: true });
  });

  it('retorna { pastDate: true } para hace 7 días', () => {
    const sevenDaysAgo = addDays(-7);
    const control = new FormControl(sevenDaysAgo);
    expect(validate(control)).toEqual({ pastDate: true });
  });

  it('retorna { pastDate: true } para hace 30 días', () => {
    const thirtyDaysAgo = addDays(-30);
    const control = new FormControl(thirtyDaysAgo);
    expect(validate(control)).toEqual({ pastDate: true });
  });

  it('retorna { pastDate: true } para hace 365 días', () => {
    const yearAgo = addDays(-365);
    const control = new FormControl(yearAgo);
    expect(validate(control)).toEqual({ pastDate: true });
  });

  it('retorna { invalidDate: true } para cadena no válida "invalid-date"', () => {
    const control = new FormControl('invalid-date');
    expect(validate(control)).toEqual({ invalidDate: true });
  });

  it('retorna { invalidDate: true } para cadena arbitraria "xyz"', () => {
    const control = new FormControl('xyz');
    expect(validate(control)).toEqual({ invalidDate: true });
  });
});
