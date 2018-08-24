import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { anime } from '../../vendor';

@Component({
  selector: 'av-expanding-button',
  templateUrl: './av-expanding-button.component.html'
})
export class AVExpandingButtonComponent implements OnInit {
  @HostBinding('style.display') private displayStyle = 'block';
  @HostBinding('style.position') private positionStyle = 'relative';

  @ViewChild('label') private label: ElementRef;
  @Input() private destination: string;

  constructor(private elementRef: ElementRef) {}

  public ngOnInit(): void {
    this.element.style.position = 'absolute';
    this.element.style.top = '50%';
    this.element.style.left = '50%';
    this.element.style.transform = 'translateX(-50%) translateY(-50%)';
    this.element.style.opacity = '0';
    this.element.style.transformOrigin = 'left top';

    setTimeout(() => {
      anime({
        targets: this.element,
        scale: ['0', '1'],
        opacity: ['1', '1'],
        translateX: ['-50%', '-50%'],
        translateY: ['-50%', '-50%'],
        duration: 1500,
        elasticity: 400
      });
    }, 500);
  }

  @HostListener('click')
  private expand() {
    let buttonHeight = this.element.getBoundingClientRect().height;

    let targetSize = Math.max(
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    ) * 1.5;

    anime({
      targets: this.label.nativeElement,
      opacity: '0',
      elasticity: 0,
      duration: 400
    }).finished.then(() => {
      anime({
        targets: this.element,
        width: buttonHeight + 'px',
        borderRadius: '50%',
        duration: 500,
        elasticity: 400
      }).finished.then(() => {
        anime({
          targets: this.element,
          width: targetSize + 'px',
          height: targetSize + 'px',
          elasticity: 0,
          duration: 1000
        }).finished.then(() => {
          window.location.href = this.destination;
        });
      });
    });
  }

  get element(): HTMLElement {
    return <HTMLElement>this.elementRef.nativeElement.querySelector('button');
  }
}
