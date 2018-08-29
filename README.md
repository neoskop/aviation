![Aviation](./logo.png)

# Aviation

_Aviation_ is a web application to enable **feature toggles as a service**.

_Aviation_ is also a classy cocktail which you should - according to Hugo Ensslin in 1916 - prepare like so:

- ⅓ Lemon Juice
- ⅔ El Bart Gin
- 2 dashes Maraschino
- 2 dashes Crème de Violette

Shake well in a mixing glass with cracked ice, strain and serve.

## Overview

In contrast to the more common feature toggle libraries, _Aviation_ relies on an external server to provide the library with information whether features are enabled or not. The project is therefore divided in a [server component](./server) and client libraries for different languages. Currently the following languages are supported:

- [Java](./clients/java)
- [JavaScript/Typescript](./clients/typescript)

See the README files of those submodules on how to integrate those libraries into your project.

In addition to server and client libraries we also included a small [Chrome plug-in](./chrome) which you can use to set a special HTTP request header which can be used to switch new features on temporarily.

## Quickstart

Checkout the [docker-compose.yml](./server/docker-compose.yml) file and start the containers via `docker-compose up`. You can then access the server frontend by pointing your browser to http://localhost:3000.

## License

This project is under the terms of the Apache License, Version 2.0. A [copy of this license](LICENSE) is included with the sources.