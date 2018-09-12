import { AviationClient } from "../aviation-client";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as request from "superagent";
import { AviationFeature } from "../model/aviation-feature";

beforeEach(() => {
  this.clock = sinon.useFakeTimers();
  AviationClient._featureCaches = {};
});

before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

afterEach(() => {
  this.clock.restore();
});

const endpointTestUrl =
  process.env["ENDPOINT_TEST_URL"] || "http://localhost:8080";

let changeFeatureTitle = function(
  sut: AviationClient,
  newTitle: string
): Promise<request.Response> {
  return sut
    .feature("test-feature-1")
    .catch(err => console.log(err))
    .then((feature: AviationFeature) => {
      let clonedFeature: AviationFeature = new AviationFeature(feature);
      clonedFeature.title = newTitle;
      return request
        .put(endpointTestUrl + "/projects/example-1/features/test-feature-1")
        .set("X-Authenticated", "true")
        .set("Accept", "application/json")
        .accept("json")
        .send(clonedFeature);
    });
};

describe("Aviation client", () => {
  it("should fail to return a feature for wrong endpoints", () => {
    let sut: AviationClient = new AviationClient(
      "http://localhost:1234",
      "wrongtoken",
      3600,
      {},
      false
    );
    return sut.feature("test").should.eventually.be.rejected;
  });

  it("should fail to return a feature for wrong token", () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "wrongtoken",
      3600,
      {},
      false
    );
    return sut.feature("test").should.eventually.be.rejected;
  });

  it("should fail to return a feature for non-managed feature", () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t",
      3600,
      {},
      false
    );
    return sut.feature("test").should.eventually.be.rejected;
  });

  it("should return feature", () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t",
      3600,
      {},
      false
    );
    sut.feature("test-feature-1").catch(err => console.log(err));
    return sut.feature("test-feature-1").should.eventually.be.fulfilled;
  });

  it("should return feature that can be evaluated", () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t",
      3600,
      {},
      false
    );
    sut.feature("test-feature-1").catch(err => console.log(err));
    return sut
      .feature("test-feature-1")
      .should.eventually.be.fulfilled.and.then((f: AviationFeature) => {
        f.evaluate().should.be.true;
      });
  });

  it("should pickup feature changes after cache timeout", async () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t",
      3600,
      {},
      false
    );
    await changeFeatureTitle(sut, "test 1");
    this.clock.tick(60 * 60 * 1000);
    return sut
      .feature("test-feature-1")
      .should.eventually.be.fulfilled.and.then((f: AviationFeature) => {
        return f.title.should.equal("test 1");
      });
  });

  it("should not pickup feature changes before cache timeout", async () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t",
      3600,
      {},
      false
    );
    await changeFeatureTitle(sut, "test 2");
    return sut
      .feature("test-feature-1")
      .should.eventually.be.fulfilled.and.then((f: AviationFeature) => {
        return f.title.should.not.equal("test 2");
      });
  });

  it("should pickup feature changes immediately via WebSockets", async () => {
    let sut: AviationClient = new AviationClient(
      endpointTestUrl,
      "sup3rs3cr3t"
    );
    await changeFeatureTitle(sut, "test 3");
    return sut
      .feature("test-feature-1")
      .should.eventually.be.fulfilled.and.then((f: AviationFeature) => {
        return f.title.should.equal("test 3");
      });
  });
});
