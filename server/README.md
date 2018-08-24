![Aviation](https://bytebucket.org/neoskop/aviation-client-typescript/raw/master/logo.png)

# Aviation #

_Aviation_ is a web application to enable **feature toggles as a service**.
_Aviation_ consists of a backend and a dashboard - both of which are
included in this repository - and client libraries to access the web
application. The currently available client libraries are:

- [aviation-client-java](https://bitbucket.org/neoskop/aviation-client-java)
- [aviation-client-typescript](https://bitbucket.org/neoskop/aviation-client-typescript)

_Aviation_ is also a classy cocktail which you should prepare like so:

- 5 cl gin
- 1.5 cl lemon juice
- 1 cl maraschino liqueur
- 0.7 cl Crème de Violette

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