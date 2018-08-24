import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as Clipboard from 'clipboard';
import { NotificationsService } from 'angular2-notifications/dist';

@Directive({
  selector: '[avClipboard]'
})
export class AVClipboardDirective implements OnInit, OnDestroy {
  private clipboard: Clipboard;

  constructor(private elementRef: ElementRef, private notificationsService: NotificationsService) {}

  public ngOnInit(): void {
    this.clipboard = new Clipboard(this.elementRef.nativeElement, {
      text: () => {
        return this.elementRef.nativeElement.value;
      }
    });

    this.clipboard.on('success', () => {
      this.notificationsService.success('Copied to Clipboard.');
      this.elementRef.nativeElement.focus();
    });
  }

  public ngOnDestroy(): void {
    this.clipboard.destroy();
  }
}
