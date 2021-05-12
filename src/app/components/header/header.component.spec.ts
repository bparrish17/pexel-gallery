import { Shallow } from "shallow-render";
import { HeaderComponent } from './header.component';
import { AppModule } from "src/app/app.module";

describe('HeaderComponent', () => {
  let shallow: Shallow<HeaderComponent>;

  beforeEach(() => {
    shallow = new Shallow(HeaderComponent, AppModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render()
    expect(instance).toBeDefined();
  });
  
  describe('[Render]', () => {
    it('Should have header of "Pexels Gallery"', async () => {
      const { find } = await shallow.render();
      expect(find('h1').nativeElement.textContent).toBe('Pexels Gallery');
    })

    it('Should have input with initial value of none', async () => {
      const { find } = await shallow.render();
      expect(find('input').nativeElement.value).toBe('');
    })

    it('Should have input with placeholder of "Search for photos..."', async () => {
      const { find } = await shallow.render();
      expect(find('input').nativeElement.placeholder).toBe('Search for photos...');
    })
  });

  describe('[Method] onInputChanged', () => {
    it('should return string from target event', async () => {
      const { instance } = await shallow.render();
      instance.onInputChanged({ target: { value: 'test' }});
      expect(instance.onSearchInput.emit).toHaveBeenCalledWith('test');
    })
  });
});
