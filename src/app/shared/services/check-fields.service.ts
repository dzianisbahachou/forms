import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CheckUserResponseData} from "../interface/responses";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CheckFieldsService {
  private checkUsernameUrl = '/api/checkUsername';

  constructor(private http: HttpClient) {}

  checkUsername(username: string):Observable<CheckUserResponseData | null> {
    return this.http.post<{ isAvailable: boolean }>(this.checkUsernameUrl, { username })
      .pipe(
        map((response: CheckUserResponseData) => response.isAvailable ? null : { isAvailable: false }),
        catchError(() => of({ isAvailable: false }))
      )
  }
}
