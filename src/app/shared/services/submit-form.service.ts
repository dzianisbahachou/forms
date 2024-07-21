import {Injectable} from '@angular/core';
import {SubmitFormResponseData} from "../interface/responses";
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class SubmitFormService {
  private submitFormUrl: string = '/api/submitForm';

  constructor(private http: HttpClient) {}

  submitForm(form: FormGroup) {
    return this.http.post<SubmitFormResponseData>(this.submitFormUrl, form);
  }
}
