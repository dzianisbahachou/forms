import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, interval, scan, Subject, take, takeWhile, timer} from "rxjs";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit{
  progressValue: number = 0;

  ngOnInit() {
    interval(250)
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
}
