package de.neoskop.aviation;

import de.neoskop.aviation.model.AviationFeatureImpl;
import retrofit2.Call;
import retrofit2.http.*;

import java.util.List;
import java.util.Map;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public interface AviationApiService {
	@GET("/features")
	Call<List<Map<String, Object>>> getFeatures(@Header("Authorization") String authorization);

	@PUT("/projects/{projectName}/features/{featureName}")
	Call<Map<String, Object>> updateFeature(@Path("projectName") String projectName, @Path("featureName") String featureName, @Header("X-Authenticated") boolean authenticated, @Body Map<String, Object> feature);
}
