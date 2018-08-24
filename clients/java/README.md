![Aviation](logo.png)

# Aviation Client for Java ≥ 8 #

This library enables you to check against an [Aviation Server](https://bitbucket.org/neoskop/aviation) whether a feature is supposedly enabled or not.

## Usage ##

To add the library to your project by adding the following snippet to your `pom.xml`:

```xml
<dependency>
    <groupId>de.neoskop.aviation</groupId>
    <artifactId>aviation-client</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

To use the imported library import the packages like so:

```java
import de.neoskop.aviation.AviationClient;
import static de.neoskop.aviation.AviationClientBuilder.aviation;
```

and create a client and check for a feature by executing:

```java
final AviationClient aviation = aviation()
  .endpoint("http://localhost:8080")
  .token("sup3rs3cr3t")
  .request(() -> getRequestObject())
  .mix();
aviation.feature("test-feature-1")
    .on(() -> System.out.println("Feature enabled!"))
    .off(() -> System.out.println("Feature disabled!"));
```

## Test suite ##

To run integration tests in case you checked out the repository (awesome!):

```sh
$ docker-compose -f docker-compose.test.yml up --abort-on-container-exit --build
```