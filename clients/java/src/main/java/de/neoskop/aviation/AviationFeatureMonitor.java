package de.neoskop.aviation;

import io.socket.client.IO;
import io.socket.client.Socket;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Arne Diekmann
 * @since 12.07.17
 */
public class AviationFeatureMonitor {
	private static List<AviationClient> subscribers = new ArrayList<>();
	private static Map<AviationApiConnectionInfo, Socket> connections = new HashMap<>();

	public static void subscribe(AviationClient client) {
		final AviationApiConnectionInfo connectionInfo = client.getConnectionInfo();
		subscribers.add(client);

		if (!connections.containsKey(connectionInfo)) {
			try {
				final Socket socket = IO.socket(connectionInfo.getSioUrl());
				socket.on("featureUpdate", objects -> {
					try {
						final JSONObject updatedFeature = new JSONObject((String) objects[0]);
						subscribers.stream().filter(connectionInfo::belongsToClient).forEach(c -> c.updateFeature(updatedFeature));
					} catch (JSONException ignored) {
					}
				});
				socket.connect();
				connections.put(connectionInfo, socket);
			} catch (URISyntaxException e) {
				throw new IllegalArgumentException("Connection URL is invalid: " + connectionInfo.getSioUrl());
			}
		}
	}
}
