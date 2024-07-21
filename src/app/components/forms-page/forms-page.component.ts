import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {SubmitFormResponseData} from "../../shared/interface/responses";
import {animate, style, transition, trigger} from "@angular/animations";
import {TimerService} from "../../shared/services/timer.service";
import {SubmitFormService} from "../../shared/services/submit-form.service";
import {SuccessSubmittingFormMessageComponent} from "../../shared/components/success-submitting-form-message/success-submitting-form-message.component";

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.scss',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-10px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      // For :leave event I set 0ms time because when the form submitted then on the UI we can see
      // the card disappearing animation (including resetting the validation) and new card appearing.
      // You can test it by setting 300ms for :leave event
      transition(':leave', [
        animate('0ms ease-out', style({opacity: 0, transform: 'translateY(-10px)'})),
      ]),
    ])
  ]
})
export class FormsPageComponent implements OnInit, OnDestroy {

  @ViewChild(SuccessSubmittingFormMessageComponent) successSubmittingFormMessageComponent!: SuccessSubmittingFormMessageComponent;

  formArray: FormArray<FormGroup>;
  mainForm!: FormGroup;
  maxForms: number = 10;
  submissionInProgress: boolean = false;
  timer: number = 0;

  isInvalidFormsVisible: boolean = false;
  invalidFormsCountControl: FormControl = new FormControl(0);

  subscriptions: Subscription[] = [];
  subscriptionNames: string[] = [];

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private timerService: TimerService,
    private submitFormService: SubmitFormService,
    private fb: FormBuilder
  ) {
    this.formArray = this.fb.array<FormGroup>([]);
    this.mainForm = this.fb.group({
      forms: this.formArray
    }, {updateOn: "change"})
  }

  private addSubscription(name: string, subscription: Subscription): void {
    this.subscriptions.push(subscription);
    this.subscriptionNames.push(name);
  }

  ngOnInit(): void {
    this.addForm();
    this.zone.runOutsideAngular(() => {

      this.addSubscription('mainFormChanges', this.mainForm.statusChanges.subscribe((status) => {
        this.updateInvalidFormsCount();
        this.checkFormComplete();
      }));
        this.zone.run(() => {
          this.cdr.detectChanges();
        });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  createForm(): FormGroup {
    return this.fb.group({});
  }

  addForm(): void {
    this.zone.runOutsideAngular(() => {
      if (this.formArray.length < this.maxForms) {
        this.formArray.push(this.createForm());
      }
      this.zone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  removeForm(formId: number): void {
    this.formArray.removeAt(formId);
  }

  submitForms(): void {
    if (this.mainForm.valid) {
      this.submissionInProgress = true;
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timer = 5;
    this.addSubscription('timer', this.timerService.startTimer().subscribe(
      () => this.timer -= 1,
      () => console.log('error'),
      () => this.finalizeSubmission()
    ));
  }

  unsubscribeByName(name: string): void {
    const index: number = this.subscriptionNames.indexOf(name);
    if (index !== -1) {
      this.subscriptions[index].unsubscribe();
      this.subscriptions.splice(index, 1);
      this.subscriptionNames.splice(index, 1);
    }
  }

  finalizeSubmission(): void {
    if (this.submissionInProgress) {
      this.submitToBackend();
    }
  }

  cancelSubmission(): void {
    this.submissionInProgress = false;
    this.unsubscribeByName('timer');
  }

  resetForms(): void {
    this.formArray.clear();
    this.addForm();
  }

  updateInvalidFormsCount(): void {
    const invalidForms: number =  this.formArray.controls.filter((form: { invalid: boolean; }) => form.invalid).length;
    this.invalidFormsCountControl.setValue(invalidForms);
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  checkFormComplete(): void {
    const formArrayTouchedOrDirty: boolean = this.formArray.controls.some((control: any) => control.dirty || control.touched);
    const hasInvalidForms: boolean = this.invalidFormsCountControl.value > 0;
    this.isInvalidFormsVisible = formArrayTouchedOrDirty && hasInvalidForms;
  }

  submitToBackend(): void {
    this.submitFormService.submitForm(this.mainForm).subscribe(
      (data: SubmitFormResponseData) => {
        this.submissionInProgress = false;

        const result: string = data.result;
        // in case a real data I would check such way: if(result){...}
        if (result === 'nice job') {
          console.log('Submitting forms to backend:', this.mainForm.value.forms);
          this.mainForm.reset();
          this.resetForms();
          this.submissionInProgress = false;
          this.isInvalidFormsVisible = false;
          this.invalidFormsCountControl.setValue(0);
          this.timer = 5;
          this.successSubmittingFormMessageComponent.showMessage();
        }
      },
      // in mock backend there are not any error handler, so I just stayed console.log(error)
      // in case some backend error handling I would add the handler that represent the error
      error => {
        console.log(error);
      }
    )
  }
}
