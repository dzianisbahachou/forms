import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-invalid-forms-count',
  templateUrl: './invalid-forms-count.component.html',
  styleUrl: './invalid-forms-count.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InvalidFormsCountComponent),
      multi: true
    }
  ]
})
export class InvalidFormsCountComponent implements ControlValueAccessor{
  @Input() count: number = 0;

  writeValue(count: number): void {
      this.count = count;
  }

  registerOnChange() {}

  registerOnTouched() {}

  setDisabledState() {}
}
