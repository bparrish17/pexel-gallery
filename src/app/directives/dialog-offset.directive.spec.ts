import { ElementRef } from '@angular/core';
import { DialogOffsetDirective } from './dialog-offset.directive';

describe('DialogOffsetDirective', () => {
  const mockDocument = { location: { pathname: 'testpath' }, getElementsByClassName: () => [new HTMLElement()] };
  it('should create an instance', () => {
    const directive = new DialogOffsetDirective(new ElementRef('button'), mockDocument as any);
    expect(directive).toBeTruthy();
  });
});
