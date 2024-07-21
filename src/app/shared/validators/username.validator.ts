import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';
import { UsernameValidationService } from "../services/check-user-name.service";

export function UsernameAsyncValidator(usernameService: UsernameValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // Возвращаем null, если поле пустое
    }
    return of(control.value).pipe(
      debounceTime(300),
      switchMap(value =>
        usernameService.checkUsername(value).pipe(
          map(response => response.isAvailable ? null : { isAvailable: false }),
          catchError(() => of({ isAvailable: false }))
        )
      )
    );
  };
}
