import {Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy, HostListener} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective implements OnInit, OnDestroy {
  @Input() appValidation?: AbstractControl;
  @Input() validationType: string | undefined;

  private errorTooltip?: HTMLElement;
  private subscription: Subscription | undefined;
  private isInvalid: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('focus') onMouseEnter() {
    if (this.isInvalid) {
      this.showErrorTooltip();
    }
  }

  @HostListener('blur') onMouseLeave() {
      this.hideErrorTooltip();
  }

  ngOnInit() {
    this.subscription = this.appValidation?.statusChanges.subscribe(status => {
        if (status === 'INVALID') {
          this.showErrorMessage();
          this.isInvalid = true
        }
        else if (status === "VALID") {
          this.hideErrorMessage();
          this.isInvalid = false
        }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private showErrorMessage() {
    const errorMessage = `Please provide a correct ${this.validationType}`;

    if (!this.el.nativeElement.parentNode.querySelector('.invalid-tooltip')) {
      this.errorTooltip = this.renderer.createElement('div');
      this.renderer.addClass(this.errorTooltip, 'invalid-tooltip');
      this.renderer.appendChild(this.errorTooltip, this.renderer.createText(errorMessage));

      const targetElement = this.el.nativeElement.parentNode;

      this.renderer.appendChild(targetElement, this.errorTooltip);
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
    }
  }

  private hideErrorMessage() {
    if (this.el.nativeElement.tagName !== 'DIV') {
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
    }
    this.hideErrorTooltip()
  }

  private showErrorTooltip() {
    const targetElement = this.el.nativeElement.tagName === 'DIV' ? this.el.nativeElement : this.el.nativeElement.parentNode;
    this.renderer.appendChild(targetElement, this.errorTooltip);
  }

  private hideErrorTooltip() {
    if (this.el.nativeElement.parentNode.querySelector('.invalid-tooltip')) {
      const targetElement = this.el.nativeElement.tagName === 'DIV' ? this.el.nativeElement : this.el.nativeElement.parentNode;
      this.renderer.removeChild(targetElement, this.errorTooltip);
    }
  }
}
