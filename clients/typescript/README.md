![Aviation](../../logo.png)

# Aviation Client for Typescript #

![npm version](https://img.shields.io/npm/v/@neoskop/aviation-client.svg?colorA=333333&colorB=573066) ![npm download per month](https://img.shields.io/npm/dm/@neoskop/aviation-client.svg?colorA=333333&colorB=e1d259) ![npm license](https://img.shields.io/npm/l/express.svg?colorA=333333&colorB=4aa4ce)

This library enables you to check against an [Aviation Server](https://github.com/neoskop/aviation) whether a feature is supposedly enabled or not.

## Usage ##

To add the library to your project:

```sh
$ npm i @neoskop/aviation-client
```

To check for a feature:

```typescript
let client: AviationClient = aviation().endpoint('http://localhost:8080').token('sup3rs3cr3t').mix();

client.feature('test-feature-1').then(f => {
  if (f.evaluate()) {
    console.log('feature is enabled!');
  } else {
    console.log('feature is disabled!');
  }
}).catch((err) => {
  console.log('could not retrieve feature from server!', err);
});
```

## Test suite ##

To run integration tests in case you checked out the repository (awesome!):

```sh
$ docker pull neoskop/aviation:backend && docker-compose -f docker-compose.test.yml up --abort-on-container-exit --build
```