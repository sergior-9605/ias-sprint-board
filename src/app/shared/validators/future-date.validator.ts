import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;

    if (!value)
      return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(`${value}T00:00:00`);
    
    if (Number.isNaN(date.getTime()))
      return { invalidDate: true };
    
    return date < today ? { pastDate: true } : null;
  };
}