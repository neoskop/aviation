package de.neoskop.aviation.model;

import de.neoskop.aviation.util.Command;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
public class AviationFallbackFeature implements AviationFeature {
	private final String name;
	private final AviationFeatureState fallbackState;

	public AviationFallbackFeature(String name, AviationFeatureState fallbackState) {
		this.name = name;
		this.fallbackState = fallbackState;
	}

	@Override
	public AviationFeature on(Command command) {
		if (fallbackState.equals(AviationFeatureState.ON)) {
			command.accept();
		}

		return this;
	}

	@Override
	public AviationFeature off(Command command) {
		if (fallbackState.equals(AviationFeatureState.OFF)) {
			command.accept();
		}

		return this;
	}

	@Override
	public String getName() {
		return name;
	}
}
