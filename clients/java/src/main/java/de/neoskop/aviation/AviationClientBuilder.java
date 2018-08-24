package de.neoskop.aviation;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public class AviationClientBuilder {
	private String endpointUrl;
	private String token;
	private Map<String, Object> meta = new HashMap<>();
	private Supplier<HttpServletRequest> requestSupplier;
	private boolean realtime = true;

	public static AviationClientBuilder aviation() {
		return new AviationClientBuilder();
	}

	public AviationClientBuilder endpoint(String endpointUrl) {
		this.endpointUrl = endpointUrl;
		return this;
	}

	public AviationClientBuilder token(String token) {
		this.token = token;
		return this;
	}

	public AviationClientBuilder meta(String key, Object value) {
		meta.put(key, value);
		return this;
	}

	/**
	 * Determines whether to update features in real time (defaults to true)
	 * @return itself
	 */
	public AviationClientBuilder realtime(boolean realtime) {
		this.realtime = realtime;
		return this;
	}

	public AviationClientBuilder request(Supplier<HttpServletRequest> requestSupplier) {
		this.requestSupplier = requestSupplier;
		return this;
	}

	public AviationClient mix() {
		return new AviationClient(endpointUrl, token, meta, requestSupplier, realtime);
	}
}
