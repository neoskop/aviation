![Aviation](../logo.png)

# Aviation Server #

This is the server component which provides a frontend to configure feature toggles and an API for client libraries to check against.

## Quick start ##

```
$ docker-compose up
```

## API documentation ##

### apidoc ###

To generate the documentation of the backend run:

```
$ cd backend
$ yarn install
$ npm run doc
```

Afterwards open `backend/doc/index.html`.

### Postman ###

Import `Aviation.postman_collection.json` in Postman to find suitable
examples for all API calls.

## Test suite ##

To run backend integration tests:

```sh
$ docker-compose -f backend/docker-compose.test.yml up --abort-on-container-exit --build
```