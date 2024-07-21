import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SubmitFormResponseData} from "../interface/responses";

@Injectable({
  providedIn: 'root'
})
export class SubmitFormService {

  constructor(private http: HttpClient) { }

  submitForm(form: any) {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', form);
  }
}
