package de.neoskop.aviation;

import java.util.Objects;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public class AviationApiConnectionInfo {
	private final String endpointUrl;
	private final String token;

	public AviationApiConnectionInfo(String endpointUrl, String token) {
		this.endpointUrl = endpointUrl;
		this.token = token;
	}

	public String getEndpointUrl() {
		return endpointUrl;
	}

	public String getToken() {
		return token;
	}

	public String getAuthHeader() {
		return "Bearer " + token;
	}

	public String getSioUrl() {
		return endpointUrl + "/?auth_token=" + token;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		AviationApiConnectionInfo that = (AviationApiConnectionInfo) o;
		return Objects.equals(endpointUrl, that.endpointUrl) &&
				Objects.equals(token, that.token);
	}

	@Override
	public int hashCode() {
		return Objects.hash(endpointUrl, token);
	}

	public boolean belongsToClient(AviationClient client) {
		return client.getConnectionInfo().equals(this);
	}
}
