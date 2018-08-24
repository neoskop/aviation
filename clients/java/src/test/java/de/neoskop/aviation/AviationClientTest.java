package de.neoskop.aviation;

import de.neoskop.aviation.model.AviationFallbackFeature;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import static de.neoskop.aviation.model.AviationFeatureState.OFF;
import static org.junit.jupiter.api.Assertions.*;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
class AviationClientTest {
	private static final  String ENDPOINT_TEST_URL = StringUtils.isBlank(System.getenv("ENDPOINT_TEST_URL")) ? "http://localhost:8080" :
			System.getenv("ENDPOINT_TEST_URL");

	@Test
	void wrongEndpoint() {
		final AviationClient sut = new AviationClient("https://doesnotexist", "wrongtoken", Collections.emptyMap(), null, false);
		assertTrue(sut.feature("test") instanceof AviationFallbackFeature);
	}

	@Test
	void invalidToken() {
		final AviationClient sut = new AviationClient(ENDPOINT_TEST_URL, "wrongtoken", Collections.emptyMap(), null, false);
		assertTrue(sut.feature("test") instanceof AviationFallbackFeature);
	}

	@Test
	void notExistingFeatureValidRequest() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		final AviationClient sut = new AviationClient(ENDPOINT_TEST_URL, "sup3rs3cr3t", Collections.emptyMap(), null, false);
		assertTrue(sut.feature("doesnotexist") instanceof AviationFallbackFeature);
	}

	@Test
	void validRequest() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		final AviationClient sut = new AviationClient(ENDPOINT_TEST_URL, "sup3rs3cr3t", Collections.emptyMap(), null, false);
		sut.feature("test-feature-1", OFF).on(() -> executedCommand.set(true));
		assertTrue(executedCommand.get());
	}

	@Test
	void socketIoTest() throws IOException, InterruptedException {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		final AviationClient sut = new AviationClient(ENDPOINT_TEST_URL, "sup3rs3cr3t", Collections.emptyMap(), null, true);
		setFeatureState(false);
		sut.feature("test-feature-1").off(() -> executedCommand.set(true));
		setFeatureState(true);
		assertTrue(executedCommand.get());
	}

	private void setFeatureState(boolean enabled) throws IOException, InterruptedException {
		final AviationApiService apiService = AviationClient.getApiService(ENDPOINT_TEST_URL);
		final Map<String, Object> featureMap = new HashMap<>();
		featureMap.put("name", "test-feature-1");
		featureMap.put("title", "test 1");
		featureMap.put("enabled", enabled);
		featureMap.put("functionCode", "");
		featureMap.put("functionEnabled", false);
		apiService.updateFeature("example-1", "test-feature-1", true, featureMap).execute();
		Thread.sleep(100);
	}
}