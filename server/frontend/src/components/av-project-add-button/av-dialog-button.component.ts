import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { anime } from '../../vendor';

@Component({
  selector: 'av-dialog-button',
  templateUrl: './av-dialog-button.component.html'
})
export class AVDialogButtonComponent implements OnInit {
  @HostBinding('style.display') private displayStyle = 'block';

  @ViewChild('button') private _buttonElementRef: ElementRef;
  @ViewChild('bubble') private _bubbleElementRef: ElementRef;

  private active = false;

  constructor() {}

  public ngOnInit(): void {
  }

  public toggle() {
    if (this.active) {
      this.hideDialog();
    } else {
      this.showDialog();
    }
  }

  public showDialog() {
    if (!this.active) {
      this.active = true;
      this._bubbleElementRef.nativeElement.style.pointerEvents = 'auto';

      anime({
        targets: this.button,
        rotate: ['0deg', '45deg'],
        easing: 'easeOutElastic'
      });

      anime({
        targets: this.bubble,
        opacity: 1,
        translateY: ['-20px', '0'],
        translateX: ['-50%', '-50%'],
        easing: 'easeOutElastic'
      });
    }
  }

  public hideDialog() {
    if (this.active) {
      this.active = false;
      this._bubbleElementRef.nativeElement.style.pointerEvents = 'none';

      anime({
        targets: this.button,
        rotate: ['45deg', '0deg'],
        easing: 'easeInElastic'
      });

      anime({
        targets: this.bubble,
        opacity: 0,
        translateY: ['0', '-20px'],
        translateX: ['-50%', '-50%'],
        easing: 'easeInElastic'
      });
    }
  }

  get button(): HTMLElement {
    return this._buttonElementRef.nativeElement;
  }

  get bubble(): HTMLElement {
    return this._bubbleElementRef.nativeElement;
  }
}
