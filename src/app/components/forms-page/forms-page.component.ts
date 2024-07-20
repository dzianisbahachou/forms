import {AfterViewChecked, ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {interval, Subscription, take} from "rxjs";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.scss'
})
export class FormsPageComponent implements OnInit, OnDestroy {
  formArray!: any;
  mainForm!: FormGroup;
  maxForms: number = 10;
  invalidFormsCount: number = 0;
  submissionInProgress: boolean = false;
  timer: number = 0;
  subscriptions: Subscription[] = [];

  private fb: FormBuilder = inject(FormBuilder);

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, public ngb: NgbModule) {
    this.formArray = this.fb.array([]);
    this.mainForm = this.fb.group({
      forms: this.formArray
    }, {updateOn: "change"})
  }

  ngOnInit(): void {
    // used timeout to get rid of ExpressionChangedAfterItHasBeenCheckedError error
    this.addForm();
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(this.mainForm.valueChanges.subscribe(() => {
        this.updateInvalidFormsCount();
      }));
        this.zone.run(() => {
          this.cdr.detectChanges();
        })
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): FormGroup {
    return this.fb.group({});
  }

  addForm() {
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
    this.submissionInProgress = true;
    this.startTimer()
  }

  startTimer(): void {
    this.timer = 5
    const timerSubmission$ = interval(1000)
      .pipe(
        take(this.timer)
      );
    const timerSubscription: Subscription = timerSubmission$.subscribe(
      () => this.timer -= 1,
      () => console.log('error'),
      () => this.finalizeSubmission()
    );
    this.subscriptions.push(timerSubscription);
  }

  finalizeSubmission(): void {
    if (this.submissionInProgress) {
      this.submitToBackend();
      this.resetForms();
    }
    this.submissionInProgress = false;
    this.timer = 5;
  }

  cancelSubmission() {
    this.submissionInProgress = false;
    this.timer = 5;
  }

  resetForms(): void {
    this.formArray.clear();
    this.addForm();
  }

  updateInvalidFormsCount(): void {
    this.invalidFormsCount = this.formArray.controls.filter((form: { invalid: any; }) => form.invalid).length;
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  submitToBackend() {
    console.log('Submitting forms to backend:', this.mainForm.value.forms);
    this.formArray.clear();
    this.submissionInProgress = false;
  }
}
