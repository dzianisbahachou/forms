// username-validation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernameValidationService {
  private checkUsernameUrl = '/api/checkUsername';

  constructor(private http: HttpClient) {}

  checkUsername(username: string): Observable<{ isAvailable: boolean }> {
    return this.http.post<{ isAvailable: boolean }>(this.checkUsernameUrl, { username });
  }
}
