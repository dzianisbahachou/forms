import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CheckFieldsService} from "../services/check-fields.service";

// I used two ways to create and handle validators because the trend move to the functions approach
// I decided to show all approaches to demonstrate my skills
export function UsernameAsyncValidator(checkFieldsService: CheckFieldsService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return checkFieldsService.checkUsername(control.value)
  };
}
