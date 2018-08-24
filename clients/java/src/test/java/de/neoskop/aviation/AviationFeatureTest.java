package de.neoskop.aviation;

import de.neoskop.aviation.model.AviationFeatureImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
class AviationFeatureTest {
	@Test
	void on() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		new AviationFeatureImpl("example-1", true, "", false).on(() -> executedCommand.set(true));
		assertTrue(executedCommand.get());
		executedCommand.set(false);
		new AviationFeatureImpl("example-1", false, "", false).on(() -> executedCommand.set(true));
		assertFalse(executedCommand.get());
		executedCommand.set(false);
	}

	@Test
	void onWithFunction() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		new AviationFeatureImpl("example-1", false, "return true;", true).on(() -> executedCommand.set(true));
		assertTrue(executedCommand.get());
		executedCommand.set(false);
		new AviationFeatureImpl("example-1", false, "return false;", true).on(() -> executedCommand.set(true));
		assertFalse(executedCommand.get());
		executedCommand.set(false);
	}

	@Test
	void onWithFunctionAndMeta() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		final AviationFeatureImpl sut = new AviationFeatureImpl("example-1", false, "return foo == 'bar';", true);
		sut.setMeta(new HashMap<String, Object>(){{ put("foo", "bar"); }});
		sut.on(() -> executedCommand.set(true));
		assertTrue(executedCommand.get());
	}

	@Test
	void onWithFunctionAndHostname() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);
		HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
		when(mockedRequest.getServerName()).thenReturn("foo");
		when(mockedRequest.getServerPort()).thenReturn(80);
		final AviationFeatureImpl sut = new AviationFeatureImpl("example-1", false, "return hostname == 'foo';", true);
		sut.setRequestSupplier(() -> mockedRequest);
		sut.on(() -> executedCommand.set(true));
		assertTrue(executedCommand.get());
	}

	@Test
	void orElse() {
		final AtomicBoolean executedCommand = new AtomicBoolean(false);

		new AviationFeatureImpl("example-1", true, "", false).off(() -> {
			executedCommand.set(true);
		});

		assertFalse(executedCommand.get());
		executedCommand.set(false);

		new AviationFeatureImpl("example-1", false, "", false).off(() -> {
			executedCommand.set(true);
		});

		assertTrue(executedCommand.get());
		executedCommand.set(false);

		new AviationFeatureImpl("example-1", false, "", false).off(() -> {
			executedCommand.set(true);
		});

		assertTrue(executedCommand.get());
		executedCommand.set(false);

		new AviationFeatureImpl("example-1", true, "", false).off(() -> {
			executedCommand.set(true);
		});

		assertFalse(executedCommand.get());
	}

}