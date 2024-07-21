import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CheckFieldsService} from "../services/check-fields.service";

export function UsernameAsyncValidator(checkFieldsService: CheckFieldsService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return checkFieldsService.checkUsername(control.value)
  };
}
