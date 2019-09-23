import { Directive, ElementRef, HostListener, Input, HostBinding, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[onlyNumber]' // tslint:disable-line
})
export class OnlyNumberDirective {

  @HostBinding('value')
  value: string;

  constructor(private el: ElementRef, private viewContainer: ViewContainerRef) {}

  @Input() onlyNumber: boolean;

  @HostListener('keypress', ['$event'])
  @HostListener('keyup', ['$event'])
  @HostListener('keydown', ['$event'])
  onEvent(event) {
    // console.log(event.type);
    const e = <KeyboardEvent> event;
    console.log(e);
    if (this.onlyNumber) {
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.keyCode === 186 || e.keyCode === 222 || e.keyCode === 188) && e.repeat === true) {
          e.preventDefault();
        }
        const key = e.keyCode || e.which;
        const stringKey = String.fromCharCode(key);
        if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
          e.preventDefault();
        }
    }

    // if (this.onlyNumber) {
    //   if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
    //     // Allow: Ctrl+A
    //     (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
    //     // Allow: Ctrl+C
    //     (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
    //     // Allow: Ctrl+V
    //     (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
    //     // Allow: Ctrl+X
    //     (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
    //     // Allow: home, end, left, right
    //     (e.keyCode >= 35 && e.keyCode <= 39)) {
    //       // don't do anything
    //       return;
    //     }
    //     // Ensure that it is a number and stop the keypress
    //     if ((e.keyCode === 186 || e.keyCode === 222 || e.keyCode === 188) && e.repeat === true) {
    //       e.preventDefault();
    //     }
    //     if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    //       console.log(e);
    //       console.log('hola');
    //       e.preventDefault();
    //     }
    // }
  }

}


