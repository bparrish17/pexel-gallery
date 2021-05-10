import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input } from '@angular/core';

@Directive({
  selector: '[appDialogOffset]'
})
export class DialogOffsetDirective {

  @Input() appDialogOffset: 'top' | 'bottom';

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    const dialogClasses = [].slice.call(this.document.getElementsByClassName('mat-dialog-container'))
    const dialog = dialogClasses[0] as HTMLElement;
    const elementDiameter = this.elementRef.nativeElement.offsetWidth;
    const calcOffset = (dialogProp: number) => dialogProp - (0.5 * elementDiameter);
    this.elementRef.nativeElement.style['right'] = `${calcOffset(dialog.offsetLeft)}px`;
    this.elementRef.nativeElement.style[this.appDialogOffset] = `${calcOffset(dialog.offsetTop)}px`
  }
}
