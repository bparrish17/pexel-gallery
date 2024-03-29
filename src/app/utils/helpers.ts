import { Photo } from '../models';

  /**
   * Calculates the pixel size for fitting the photo as large as possible into 
   * 90% of the window
   * @param photo {Photo} : Photo to calculate fit for
   * @returns { width: string; height: string } : dimensions
   */
export function calculateMaxPhotoDimensions(photo: Photo): { width: string; height: string } {
  const maxPercentOfWindow = 0.82; // just a preference for what modal size I felt fit best on page
  const windowWidth = window.innerWidth * maxPercentOfWindow;
  const windowHeight = window.innerHeight * maxPercentOfWindow;
  const scale = Math.min(windowWidth/photo.width, windowHeight/photo.height);
  const calcPixelValue = (val: number) => `${val * scale}px`;
  return {
    width: calcPixelValue(photo.width),
    height: `${photo.height * scale + 62}px`
  };
}

/**
 * Use URL to create Alt tag on img
 * @param photoUrl 
 * @returns string : parsed version of photoURL
 * @description the Pexels api consistently returns a parsed description with hyphens and 
 * numbers for each photo. we're going to remove those to create a reliable alt tag
 * and aria-label
 */
export function createAltTagForPhoto(photoUrl: string): string {
  const splitURL = photoUrl.split('/');
  const possibleAlt = splitURL[splitURL.length - 2] || '';
  return possibleAlt.replace(/-/g, ' ').replace(/[0-9]/g, '');
}