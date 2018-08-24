package de.neoskop.aviation.util;

/**
 * @author Arne Diekmann
 * @since 31.05.17
 */
@FunctionalInterface
public interface Command {
	void accept();
}
