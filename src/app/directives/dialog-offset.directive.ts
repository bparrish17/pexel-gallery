import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDialogOffset]'
})
export class DialogOffsetDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    const dialogClasses = [].slice.call(this.document.getElementsByClassName('mat-dialog-container'))
    const dialog = dialogClasses[0] as HTMLElement;
    const elementLength = this.elementRef.nativeElement.offsetWidth;
    console.log('------', dialog.offsetLeft, <HTMLElement>this.elementRef.nativeElement.offsetWidth);
    console.log(`${dialog.offsetLeft + elementLength}px`);
    this.elementRef.nativeElement.style['right'] = `${dialog.offsetLeft - (0.5 * elementLength)}px`;
  }
}
