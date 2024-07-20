import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {Country} from "../../shared/enums/country";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryValidator} from "../../shared/Validators/country.validator";
import {BirthdayValidator} from "../../shared/Validators/birthday.validator";
import {UsernameAsyncValidator} from "../../shared/Validators/username.validator";
import {UsernameValidationService} from "../../shared/services/check-user-name.service";

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss'
})
export class FormCardComponent implements OnInit{

  @Input() formGroup!: any;
  @Input() index!: number;
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  countries: Country[] = Object.values(Country)

  constructor(private usernameService: UsernameValidationService) {
  }

  ngOnInit(): void {
      this.formGroup.addControl('country', new FormControl(
        '', [Validators.required, CountryValidator.validate.bind(this)]
      ))
      this.formGroup.addControl('username', new FormControl(
        '',
        [Validators.required],
        [UsernameAsyncValidator(this.usernameService)]
      ))
      this.formGroup.addControl('birthday', new FormControl(
        '',
        [Validators.required, BirthdayValidator.validate.bind(this)]
      ))
  }

  removeF(): void {
    this.remove.emit();
  }
}
