# PexelGallery

[Try the App Here](https://bparrish17.github.io/pexel-gallery/)

## Getting Started

1. Clone this directory
2. get an API Key for pixels [here](https://www.pexels.com/api)
3. run `npm run init-credentials`
4. in the newly created `src/secrets.ts`, add `export const API_KEY = 'your-api-key-here'`
5. run `npm start` - will install modules and run `ng serve` to start application
  - The app will automatically reload if you change any of the source files.
6. Open application at `localhost:4200`
7. run `npm test` to run the test suite
  - note: this will also require API_KEY to be created (although it can be a dummy value)
- Note: Node version `14.16.0`

## Other Commands

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Credits

- [Math for Rectangle Dimensions](https://stackoverflow.com/questions/1373035/how-do-i-scale-one-rectangle-to-the-maximum-size-possible-within-another-rectang)
- [Download External URLs](https://stackoverflow.com/questions/51076581/download-images-using-html-or-javascript)
- [Cause I couldn't figure out how to fake the DomSanitizer](https://stackoverflow.com/questions/59802807/create-an-instance-of-the-abstract-class-domsanitizer)
- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.12.

## Wishlist

- Accessibility
- More responsive error handling on pexels service fetching
- performance handling of infinite scroll
- proper components for the spinner, input field etc. (if it were necessary)
- modules aliases for `@services`, `@components`
- `retryWhen` operator for failed search queries
- SCSS Variables/theming
- Animation to displayed for fab buttons on dialog
- More extensive directive tests