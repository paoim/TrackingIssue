package com.rii.track;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;

public class RiiApplication extends ResourceConfig {

	/**
	 * Register JAX-RS application components.
	 */
	public RiiApplication() {
		register(RequestContextFilter.class);
		register(CategoryResource.class);
		register(ContactResource.class);
		register(IssueResource.class);
		register(MyResource.class);
		register(PriorityResource.class);
		register(StatusResource.class);
		register(PartCustomerResource.class);
		register(MultiPartFeature.class);
		register(HistoricalFixResource.class);
		register(HistoricalProblemResource.class);
		register(PhotoResource.class);
		register(TodoResource.class);
	}
}
