import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { tippy as Tippy } from '../../vendor';

@Directive({
  selector: '[tippy]'
})
export class AVTippyDirective implements OnInit {
  @Input() private tippy: any;
  private instance: any;

  constructor(private elementRef: ElementRef) {}

  public ngOnInit(): void {
    this.instance = new Tippy(this.elementRef.nativeElement, Object.assign({
      theme: 'light',
      delay: 300
    }, this.tippy));
  }
}
