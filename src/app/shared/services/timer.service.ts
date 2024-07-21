import {Injectable} from '@angular/core';
import {interval, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timer: number = 0;

  startTimer() {
    this.timer = 5;
    return interval(1000)
      .pipe(
        take(this.timer)
      );
  }}
