package de.neoskop.aviation.model;

import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8ResultUndefined;
import com.eclipsesource.v8.V8ScriptExecutionException;
import de.neoskop.aviation.util.Command;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public class AviationFeatureImpl implements AviationFeature {
	public static final String PREVIEW_HEADER = "X-Aviation-Preview";
	private final String name;
	private final Boolean enabled;
	private final String functionCode;
	private final Boolean functionEnabled;
	private List<String> metaVariables = Collections.emptyList();
	private Supplier<HttpServletRequest> requestSupplier = () -> null;
	private static V8 runtime;

	static {
		runtime = V8.createV8Runtime();
		runtime.getLocker().release();
	}

	public AviationFeatureImpl(Map<String, Object> data) {
		this((String) data.get("name"), (Boolean) data.get("enabled"), (String) data.get("functionCode"),
				(Boolean) data.get("functionEnabled"));
	}

	public AviationFeatureImpl(String name, Boolean enabled, String functionCode, Boolean functionEnabled) {
		this.name = name;
		this.enabled = enabled;
		this.functionCode = functionCode;
		this.functionEnabled = functionEnabled;
	}

	public AviationFeatureImpl(JSONObject jsonObject) throws JSONException {
		this.name = jsonObject.getString("name");
		this.enabled = jsonObject.getBoolean("enabled");
		this.functionCode = jsonObject.getString("functionCode");
		this.functionEnabled = jsonObject.getBoolean("functionEnabled");
	}

	@Override
	public AviationFeatureImpl on(Command command) {
		if (isEnabled()) {
			command.accept();
		}

		return this;
	}

	@Override
	public AviationFeatureImpl off(Command command) {
		if (!isEnabled()) {
			command.accept();
		}

		return this;
	}

	private boolean isEnabled() {
		if (functionEnabled != null && functionEnabled) {
			String script = prepareScript();

			try {
				runtime.getLocker().acquire();
				return runtime.executeBooleanScript(script);
			} catch (V8ScriptExecutionException | V8ResultUndefined e) {
				return false;
			} finally {
				runtime.getLocker().release();
			}
		}

		return enabled;
	}

	private String prepareScript() {
		StringBuilder sb = new StringBuilder("(function(){");
		metaVariables.forEach(sb::append);
		sb.append(addRequestAttributes());
		sb.append(functionCode).append("})()");
		return sb.toString();
	}

	private String addRequestAttributes() {
		StringBuilder sb = new StringBuilder();
		final HttpServletRequest request = requestSupplier.get();

		if (request != null) {
			sb.append(assignVariable("hostname", getHostnameFromRequest(request)));
			sb.append(assignVariable("preview", getPreviewValueFromRequest(request)));
		} else {
			sb.append(assignVariable("hostname", ""));
			sb.append(assignVariable("preview", "false"));
		}

		return sb.toString();
	}

	private String getHostnameFromRequest(HttpServletRequest request) {
		String hostName;

		if (request.getHeader("X-Forwarded-Host") != null) {
			hostName = request.getHeader("X-Forwarded-Host");
		} else {
			hostName = request.getServerName() + (request.getServerPort() != 80 && request.getServerPort() != 443
					? ":" + request.getServerPort() : "");
		}

		return hostName;
	}

	private Boolean getPreviewValueFromRequest(HttpServletRequest request) {
		final String header = request.getHeader(PREVIEW_HEADER);
		return header != null && "True".equalsIgnoreCase(header);
	}

	private String assignVariable(String name, Object value) {
		StringBuilder sb = new StringBuilder(name + " = ");
		boolean addQuotes = true;

		if (value instanceof Boolean || value instanceof Integer) {
			addQuotes = false;
		}

		if (addQuotes) {
			sb.append("'").append(String.valueOf(value)).append("'");
		} else {
			sb.append(String.valueOf(value));
		}

		return sb.append(";").toString();
	}

	private String assignVariables(Map.Entry<String, Object> entry) {
		return assignVariable(entry.getKey(), entry.getValue());
	}

	@Override
	public void setRequestSupplier(Supplier<HttpServletRequest> requestSupplier) {
		this.requestSupplier = requestSupplier;
	}

	@Override
	public void setMeta(Map<String, Object> meta) {
		metaVariables = meta.entrySet().stream().map(this::assignVariables).collect(Collectors.toList());
	}

	@Override
	public String getName() {
		return name;
	}
}
