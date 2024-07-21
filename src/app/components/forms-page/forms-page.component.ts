import { ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {interval, Subscription, take} from "rxjs";
import {SubmitFormService} from "../../shared/services/submit-form.service";
import {SubmitFormResponseData} from "../../shared/interface/responses";

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.scss'
})
export class FormsPageComponent implements OnInit, OnDestroy {
  formArray!: any;
  mainForm!: FormGroup;
  maxForms: number = 10;
  submissionInProgress: boolean = false;
  timer: number = 0;

  isInvalidFormsVisible: boolean = false;


  invalidFormsCountControl: FormControl = new FormControl(0);

  subscriptions: Subscription[] = [];
  subscriptionNames: string[] = [];

  private fb: FormBuilder = inject(FormBuilder);

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private submitFormService: SubmitFormService
  ) {
    this.formArray = this.fb.array([]);
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
        })
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      })
    })
  }

  removeForm(formId: number): void {
    this.formArray.removeAt(formId)
  }

  submitForms(): void {
    if (this.mainForm.valid) {
      this.submissionInProgress = true;
      this.startTimer()
    }
  }

  startTimer(): void {
    this.timer = 5
    const timerSubmission$ = interval(1000)
      .pipe(
        take(this.timer)
      );

    this.addSubscription('timer', timerSubmission$.subscribe(
      () => this.timer -= 1,
      () => console.log('error'),
      () => this.finalizeSubmission()
    ));
  }

  unsubscribeByName(name: string): void {
    const index = this.subscriptionNames.indexOf(name);
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
    this.unsubscribeByName('timer')
  }

  resetForms(): void {
    this.formArray.clear();
    this.addForm();
  }

  updateInvalidFormsCount(): void {
    const invalidForms =  this.formArray.controls.filter((form: { invalid: boolean; }) => form.invalid).length;
    this.invalidFormsCountControl.setValue(invalidForms);

    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  checkFormComplete(): void {
    const formArrayTouchedOrDirty = this.formArray.controls.some((control: any) => control.dirty || control.touched);
    const hasInvalidForms = this.invalidFormsCountControl.value > 0;
    this.isInvalidFormsVisible = formArrayTouchedOrDirty && hasInvalidForms;  }

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
        }
      },
      // in mock backend there are not any error handler, so I just stayed console.log(error)
      // in case some backend error handling I would add the handler that represent the error
      error => {
        console.log(error)
      },
      )
  }
}
