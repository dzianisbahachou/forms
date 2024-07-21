import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription, timer} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-success-submitting-form-message',
  templateUrl: './success-submitting-form-message.component.html',
  styleUrl: './success-submitting-form-message.component.scss',
  animations: [
    trigger('successMessageAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-10px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({opacity: 0, transform: 'translateY(-10px)'})),
      ]),
    ])
  ]
})
export class SuccessSubmittingFormMessageComponent implements OnDestroy{
  @Input() message: string = 'Forms submitted successfully!';

  isVisible: boolean = false;
  subscription!: Subscription;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showMessage() {
    this.isVisible = true;
    this.subscription = timer(3000).subscribe(() => this.isVisible = false)
  }
}
