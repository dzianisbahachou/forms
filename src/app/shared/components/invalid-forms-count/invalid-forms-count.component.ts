import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {count} from "rxjs";

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

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(count: any): void {
      this.count = count;
  }
  registerOnChange(fn: any): void {
      this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {

  }

}
