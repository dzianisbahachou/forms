import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, interval, scan, Subject, Subscription, take, takeWhile, timer} from "rxjs";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  progressValue: number = 0;

  subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription = interval(250)
      .pipe(
        scan((progressValue: number) => {
          return progressValue + 5;
        }, 0),
        takeWhile(()=> this.progressValue <= 100)
      )
      .subscribe(data => {
        this.progressValue = data
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
