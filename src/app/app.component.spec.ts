import { of } from "rxjs";
import { Shallow } from "shallow-render";
import { AppModule } from "src/app/app.module";
import { AppComponent } from "./app.component";
import { PexelsService } from "./services/pexels.service";

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModule);
    shallow.mock(PexelsService, { getGalleryResults: () => of({}) })
  });

  it('should create', async () => {
    const { instance } = await shallow.render()
    expect(instance).toBeDefined();
  });

  describe('[Method] onSearchInputted', () => {
    it('should next the photoSubject$ with provided input', async () => {
      const { instance } = await shallow.render();
      const nextSpy = spyOn(instance.photosSubject$, 'next');
      instance.onSearchInputted('test')
      expect(nextSpy).toHaveBeenCalledWith('test');
    })
  });

  describe('[Method] _getSearchResults', () => {
    it('should fetch images on new search inputted', async (done) => {
      const { instance, get } = await shallow.render();
      const pexelsService = get(PexelsService);
      // @ts-ignore
      instance._getSearchResults().subscribe(() => {
        expect(pexelsService.getGalleryResults).toHaveBeenCalledWith('test search');
        done();
      })
      instance.photosSubject$.next('test search')
    })

    it('should fetch new page of images when emits true', async (done) => {
      const { instance, get } = await shallow.render();
      instance.latestResults = [{ page: 3, query: 'test', photos: [] }]
      const pexelsService = get(PexelsService);
      // @ts-ignore
      instance._getSearchResults().subscribe(() => {
        expect(pexelsService.getGalleryResults).toHaveBeenCalledWith('test', 4);
        done();
      })
      // @ts-ignore
      instance.photosSubject$.next(true)
    })

    it('should set loading to false after completion', async (done) => {
      const { instance } = await shallow.render();
      // @ts-ignore
      instance._getSearchResults().subscribe(() => {
        expect(instance.loading).toBeFalse();
        done();
      })
      // @ts-ignore
      instance.photosSubject$.next('test')
    })
  });
});