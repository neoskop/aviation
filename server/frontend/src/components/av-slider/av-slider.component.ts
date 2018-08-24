import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { anime } from '../../vendor';
import { SliderService } from '../../services/slider.service';

@Component({
  selector: 'av-slider',
  templateUrl: './av-slider.component.html'
})
export class AVSliderComponent {
  @HostBinding('style.display') private displayStyle = 'block';

  @ViewChild('left') private leftSlideElementRef: ElementRef;
  @ViewChild('right') private rightSlideElementRef: ElementRef;

  private toggled = false;

  constructor(private sliderService: SliderService) {
    this.sliderService.slider = this;
  }

  public toggle() {
    if (this.toggled) {
      anime({
        targets: this.leftSlideElementRef.nativeElement,
        translateX: '0',
        opacity: ['0', '1'],
        duration: 300,
        elasticity: 0,
        easing: 'easeInOutQuad'
      });

      anime({
        targets: this.rightSlideElementRef.nativeElement,
        translateX: '0',
        opacity: ['1', '0'],
        duration: 300,
        elasticity: 0,
        easing: 'easeInOutQuad'
      });
    } else {
      anime({
        targets: this.leftSlideElementRef.nativeElement,
        translateX: '-100%',
        opacity: ['1', '0'],
        duration: 300,
        elasticity: 0,
        easing: 'easeInOutQuad'
      });

      anime({
        targets: this.rightSlideElementRef.nativeElement,
        translateX: '-100%',
        opacity: ['0', '1'],
        duration: 300,
        elasticity: 0,
        easing: 'easeInOutQuad'
      });
    }

    this.toggled = !this.toggled;
  }
}
