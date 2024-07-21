import {Injectable} from "@angular/core";
import {Country} from "../enums/country";
import {AbstractControl} from "@angular/forms";

@Injectable({
  providedIn: "root"
})

export class CountryValidator {
  static countries: Country[] = Object.values(Country)

  static validate(control: AbstractControl) {
    return this.countries.includes(control.value) ? null : { invalidCountry: true }
  }
}
