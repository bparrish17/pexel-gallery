import { Shallow } from "shallow-render";
import { AppModule } from "src/app/app.module";
import { bootstrapUnitTest } from "src/app/utils/helpers";
import { AppComponent } from "./app.component";

bootstrapUnitTest();

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModule);
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
    it('should next the photoSubject$ with provided input', async () => {
      const { instance } = await shallow.render();

    })
  });
});