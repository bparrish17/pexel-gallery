// external
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

// internal
import { PexelsService } from './pexels.service';
import { mockPexelsSearchResponse } from '../utils/mocks';

describe('PexelsService', () => {
  const expectedURL = 'https://api.pexels.com/v1/search?query=test&page=0&per_page=30';
  let service: PexelsService;
  let httpTestingController: HttpTestingController;
  const params = {
    query: 'test',
    page: '0',
    per_page: '30'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule]
    });
    service = TestBed.inject(PexelsService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[Method] searchImages', () => {
    const options = { params, headers: null };
    it('should return an observable', () => {
      const call = service.searchImages(options)
      expect(call).toBeInstanceOf(Observable);
    });

    it('should hit the Pexels API with the expected parameters', (done) => {
      service.searchImages(options).subscribe()
      const req = httpTestingController.expectOne(expectedURL)
      req.flush({});
      expect(req.request.method).toEqual('GET')
      done()
    });
  });

  describe('[Method] getGalleryResults', () => {
    let searchSpy: jasmine.Spy;

    beforeEach(() => {
      searchSpy = spyOn(service, 'searchImages').and.returnValue(of(mockPexelsSearchResponse))
    })
    
    it('should return an observable', () => {
      const call = service.getGalleryResults('test')
      expect(call).toBeInstanceOf(Observable);
    });

    it('should hit the Pexels API with the expected parameters', (done) => {
      service.getGalleryResults('test').subscribe(() => {
        expect(searchSpy).toHaveBeenCalledWith({ params, headers: jasmine.any(Object) });
        done();
      })
      done()
    });

    it('should hit the Pexels API with provided page', (done) => {
      service.getGalleryResults('test', 3).subscribe(() => {
        expect(searchSpy).toHaveBeenCalledWith({ params: { ...params, page: '4' }, headers: jasmine.any(Object) });
        done();
      })
      done()
    });

    it('should convert result into a gallery section', (done) => {
      // @ts-ignore
      const convertSpy = spyOn(service, '_convertResponseToGallerySection');
      service.getGalleryResults('test').subscribe(() => {
        expect(convertSpy).toHaveBeenCalled();
        done();
      })
    });

    it('should respond with empty response on error', (done) => {
      // @ts-ignore
      spyOn(service, '_convertResponseToGallerySection').and.callFake(() => {
        throw new Error()
      });
      service.getGalleryResults('test').subscribe((result) => {
        expect(result).toEqual({ photos: [], page: 0, query: 'test' })
        done();
      })
    });
  })

  describe('[Method] _convertResponseToGallerySection', () => {
    it('should return instance of GallerySection', () => {
      // @ts-ignore
      const gallery = service._convertResponseToGallerySection('test', mockPexelsSearchResponse);
      const examplePhoto = gallery.photos[0];
      expect(examplePhoto.expandedUrl).toBeDefined();
      expect(examplePhoto.galleryUrl).toBeDefined();
      expect(examplePhoto.src).toBeDefined();
      expect(gallery.query).toBe('test');
      expect(gallery.page).toEqual(1);
    })
  });
});
