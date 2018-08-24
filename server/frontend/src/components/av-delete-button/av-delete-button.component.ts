import {
  Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output,
  ViewChild
} from '@angular/core';
import { anime } from '../../vendor';

@Component({
  selector: 'av-delete-button',
  templateUrl: './av-delete-button.component.html'
})
export class AVDeleteButtonComponent {
  @HostBinding('style.display') private displayStyle = 'block';

  @ViewChild('buttonLabel') private labelElementRef: ElementRef;
  @ViewChild('trashLabel') private trashLabelElementRef: ElementRef;
  @ViewChild('trashTop') private trashTopElementRef: ElementRef;

  @Input() public label: string;

  @Output() private confirm: EventEmitter<void> = new EventEmitter<void>();

  public deleteState = 0;

  constructor(private elementRef: ElementRef) {}

  public trigger() {
    if (this.deleteState === 0) {
      this.updateDeleteState(1);
    } else {
      this.confirm.emit();
      this.updateDeleteState(0);
    }
  }

  private updateDeleteState(state: number) {
    this.deleteState = state;

    if (state === 1) {
      this.trashTopElementRef.nativeElement.style.transformOrigin = 'left bottom';

      anime({
        targets: this.trashTopElementRef.nativeElement,
        rotate: '-45deg'
      });
      anime({
        targets: this.trashLabelElementRef.nativeElement,
        opacity: '1'
      });

      if (this.labelElementRef) {
        anime({
          targets: this.labelElementRef.nativeElement,
          opacity: '0'
        });
      }
    } else {
      anime({
        targets: this.trashTopElementRef.nativeElement,
        rotate: '0deg'
      });
      anime({
        targets: this.trashLabelElementRef.nativeElement,
        opacity: '0'
      });

      if (this.labelElementRef) {
        anime({
          targets: this.labelElementRef.nativeElement,
          opacity: '1'
        });
      }
    }
  }

  @HostListener('click', ['$event'])
  private onClick($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  @HostListener('window:click')
  private resetDeleteState() {
    this.updateDeleteState(0);
  }

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
