import {Injectable} from "@angular/core";
import {Country} from "../enums/country";

@Injectable({
  providedIn: "root"
})

export class CountryValidator {
  static countries: Country[] = Object.values(Country)

  static validate(control: any) {
    return this.countries.includes(control.value) ? null : { invalidCountry: true }
  }
}
