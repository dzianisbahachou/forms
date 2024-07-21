import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormCardComponent} from "./components/form-card/form-card.component";
import {ReactiveFormsModule} from "@angular/forms";
import { FormsPageComponent } from './components/forms-page/forms-page.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import {ProgressBarComponent} from "./shared/components/progress-bar/progress-bar.component";
import {ValidationDirective} from "./shared/directives/validation.directive";
import {MockBackendInterceptor} from "./shared/mock-backend/mock-backend.interceptor";
import { InvalidFormsCountComponent } from './shared/components/invalid-forms-count/invalid-forms-count.component';
import { TimerPipe } from './shared/pipes/timer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FormCardComponent,
    FormsPageComponent,
    AddCardComponent,
    ProgressBarComponent,
    ValidationDirective,
    InvalidFormsCountComponent,
    TimerPipe,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
