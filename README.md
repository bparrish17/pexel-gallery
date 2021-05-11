# PexelGallery

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Credits

[Math for Rectangle Dimensions](https://stackoverflow.com/questions/1373035/how-do-i-scale-one-rectangle-to-the-maximum-size-possible-within-another-rectang)
[Download External URLs](https://stackoverflow.com/questions/51076581/download-images-using-html-or-javascript)
[Cause I couldn't figure out how to fake the DomSanitizer](https://stackoverflow.com/questions/59802807/create-an-instance-of-the-abstract-class-domsanitizer)

## Notes

- I probably could've used the "next_page" part of the response on the searchResults call, but I preferred keeping things consistent
  by using the same function arguments and passing in the previous page

## Wishlist

More responsive error handling on pexels service fetching
- retryWhen operator
- clean up _getSearchResults
- more responsive implementation of latestSearchResults
- performance
- more "complete" scss
  - variables/mixins where applicable
- proper components for the spinner, input field etc. (if it were necessary)
- Full accessibility support
- modules aliases for @services, @components