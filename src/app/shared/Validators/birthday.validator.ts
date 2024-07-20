import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class BirthdayValidator {
  static validate(control: any) {
    const currentDate: Date = new Date();
    const selectedDate: Date = new Date(control.value);
    return selectedDate > currentDate? { invalidBirthday: true }:  null;
  }
}
