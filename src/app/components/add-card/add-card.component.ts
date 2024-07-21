import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})
export class AddCardComponent {

  @Input() disabled: boolean = false;
  @Output() addForm: EventEmitter<FormGroup> = new EventEmitter();

  addNewForm() {
    this.addForm.emit();
  }
}
