import {Injectable} from "@angular/core";
import {AbstractControl} from "@angular/forms";

@Injectable({
  providedIn: "root"
})

export class BirthdayValidator {
  static validate(control: AbstractControl) {
    const currentDate: Date = new Date();
    const selectedDate: Date = new Date(control.value);
    return selectedDate > currentDate? { invalidBirthday: true }:  null;
  }
}
