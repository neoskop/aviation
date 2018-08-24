import { Directive, ElementRef, OnInit } from '@angular/core';
import { macy } from '../../vendor';

@Directive({
  selector: '[avMasonry]'
})
export class AVMasonryDirective implements OnInit {
  private masonry: any;

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.id = 'masonry' + Math.floor(Math.random() * 100000);
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.masonry = new macy({
        container: '#' + this.elementRef.nativeElement.id,
        margin: 18,
        columns: 3,
        breakAt: {
          1023: 2,
          544: 1
        }
      });

      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            this.masonry.reInit();
          }
        });
      });

      observer.observe(this.elementRef.nativeElement, {
        childList: true
      });
    });
  }
}
