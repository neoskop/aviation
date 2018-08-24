package de.neoskop.aviation;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import de.neoskop.aviation.exception.InvalidTokenException;
import de.neoskop.aviation.model.AviationFallbackFeature;
import de.neoskop.aviation.model.AviationFeature;
import de.neoskop.aviation.model.AviationFeatureImpl;
import de.neoskop.aviation.model.AviationFeatureState;
import okhttp3.OkHttpClient;
import org.json.JSONException;
import org.json.JSONObject;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import javax.servlet.http.HttpServletRequest;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public class AviationClient {
	private final AviationApiConnectionInfo connectionInfo;
	private final Map<String, Object> meta;
	private final Supplier<HttpServletRequest> requestSupplier;
	private static volatile LoadingCache<AviationApiConnectionInfo, Map<String, AviationFeature>> featureCache = Caffeine.newBuilder()
			.maximumSize(1000)
			.refreshAfterWrite(1, TimeUnit.HOURS)
			.build(AviationClient::loadFeatures);

	AviationClient(String endpointUrl, String token, Map<String, Object> meta, Supplier<HttpServletRequest> requestSupplier, boolean realtime) {
		this.requestSupplier = requestSupplier;
		this.connectionInfo = new AviationApiConnectionInfo(endpointUrl, token);
		this.meta = meta;

		if (realtime) {
			AviationFeatureMonitor.subscribe(this);
		}
	}

	public static AviationApiService getApiService(String endpointUrl) {
		OkHttpClient client = new OkHttpClient.Builder()
				.build();
		Retrofit retrofit = new Retrofit.Builder()
				.client(client)
				.baseUrl(endpointUrl)
				.addConverterFactory(JacksonConverterFactory.create())
				.build();

		return retrofit.create(AviationApiService.class);
	}

	private static Map<String, AviationFeature> loadFeatures(AviationApiConnectionInfo connectionInfo) {
		try {
			final Response<List<Map<String, Object>>> response = getApiService(connectionInfo.getEndpointUrl())
					.getFeatures(connectionInfo.getAuthHeader()).execute();

			if (response.code() == 403 || response.code() == 401) {
				throw new InvalidTokenException();
			}

			return response.body().stream().map(AviationFeatureImpl::new).filter(Objects::nonNull).collect(Collectors.toMap(AviationFeature::getName, Function.identity()));
		} catch (Throwable e) {
			return null;
		}
	}

	public AviationFeature feature(String name, AviationFeatureState fallbackState) {
		final AviationFeature defaultObject = new AviationFallbackFeature(name, fallbackState);
		final Map<String, AviationFeature> featureMap = featureCache.get(connectionInfo);

		if (featureMap == null) {
			return defaultObject;
		}

		final AviationFeature feature = featureMap.get(name);

		if (feature == null) {
			return defaultObject;
		}

		feature.setRequestSupplier(requestSupplier);
		feature.setMeta(meta);
		return feature;
	}

	public AviationFeature feature(String name) {
		return feature(name, AviationFeatureState.ON);
	}

	AviationApiConnectionInfo getConnectionInfo() {
		return connectionInfo;
	}

	public void updateFeature(JSONObject updatedFeature) {
		try {
			final AviationFeatureImpl feature = new AviationFeatureImpl(updatedFeature);
			featureCache.get(connectionInfo).put(feature.getName(), feature);
		} catch (JSONException ignored) {
		}
	}
}
