import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Shallow } from 'shallow-render';
import { AppModule } from '../app.module';
import { Photo } from '../models';

export function bootstrapUnitTest() {
  Shallow.alwaysReplaceModule(BrowserAnimationsModule, NoopAnimationsModule);
  Shallow.alwaysReplaceModule(HttpClientModule, HttpClientTestingModule);
}

  /**
   * Calculates the pixel size for fitting the photo as large as possible into 
   * 90% of the window
   * @param photo {Photo} : Photo to calculate fit for
   * @returns { width: string; height: string } : dimensions
   */
export function _calculateMaxPhotoDimensions(photo: Photo): { width: string; height: string } {
  const maxPercentOfWindow = 0.82;
  const windowWidth = window.innerWidth * maxPercentOfWindow;
  const windowHeight = window.innerHeight * maxPercentOfWindow;
  const scale = Math.min(windowWidth/photo.width, windowHeight/photo.height);
  const calcPixelValue = (val: number) => `${val * scale}px`;
  return {
    width: calcPixelValue(photo.width),
    height: `${photo.height * scale + 62}px`
  };
}