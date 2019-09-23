import { Component, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime, map, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-reactive-sticky-header',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        width: 100%;
      }
    `
  ]
})
export class ReactiveStickyHeaderComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {

    enum Direction {
      Up = 'Up',
      Down = 'Down'
    }

    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
    );

    scroll$.subscribe((scroll) => {
      console.log(scroll);
    });
  }


}
