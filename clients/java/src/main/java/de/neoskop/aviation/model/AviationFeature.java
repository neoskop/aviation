package de.neoskop.aviation.model;

import de.neoskop.aviation.util.Command;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.function.Supplier;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public interface AviationFeature {
	AviationFeature on(Command command);
	AviationFeature off(Command command);
	String getName();
	default void setRequestSupplier(Supplier<HttpServletRequest> requestSupplier) {}
	default void setMeta(Map<String, Object> meta) {}
}
