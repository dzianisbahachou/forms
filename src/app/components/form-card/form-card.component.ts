import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Country} from "../../shared/enums/country";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryValidator} from "../../shared/validators/country.validator";
import {BirthdayValidator} from "../../shared/validators/birthday.validator";
import {UsernameAsyncValidator} from "../../shared/validators/username.validator";
import {CheckFieldsService} from "../../shared/services/check-fields.service";

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss'
})
export class FormCardComponent implements OnInit{

  @Input() formGroup!: FormGroup;
  @Input() index!: number;
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  countries: Country[] = Object.values(Country)

  constructor(private checkFieldsService: CheckFieldsService) {}

  ngOnInit(): void {
      this.formGroup.addControl('country', new FormControl(
        '', [Validators.required, CountryValidator.validate.bind(this)]
      ));
      this.formGroup.addControl('username', new FormControl(
        '',
        [Validators.required],
        [UsernameAsyncValidator(this.checkFieldsService)]
      ));
      this.formGroup.addControl('birthday', new FormControl(
        '',
        [Validators.required, BirthdayValidator.validate.bind(this)]
      ));
  }

  removeForm(): void {
    this.remove.emit();
  }
}
