package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.JhipsterSampleApplicationApp;
import io.micronaut.context.annotation.Property;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.client.RxHttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.test.annotation.MicronautTest;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for the {@link io.github.jhipster.sample.web.rest.ClientForwardController} REST controller.
 */
@MicronautTest(application = JhipsterSampleApplicationApp.class)
@Property(name = "spec.name", value = "ClientForwardControllerIT")
public class ClientForwardControllerIT {

    @Inject @Client("/")
    RxHttpClient client;

    @Test
    public void getBackendEndpoint() throws Exception {
        HttpResponse<String> response = client.exchange(HttpRequest.GET("/test"), String.class).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());
        assertThat(response.header("Content-Type")).isEqualTo(MediaType.TEXT_PLAIN);
        assertThat(response.body()).isEqualTo("test");
    }

//    @Test
//    public void getClientEndpoint() throws Exception {
//        HttpResponse response = client.exchange(HttpRequest.GET("/non-existant-mapping")).blockingFirst();
//
//        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());
//        assertThat(response.header("Content-Type")).isEqualTo(MediaType.TEXT_HTML);
//    }

//    @Test
//    public void getNestedClientEndpoint() throws Exception {
//        HttpResponse response = client.exchange(HttpRequest.GET("/admin/user-management")).blockingFirst();
//
//        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());
//        assertThat(response.header("Content-Type")).isEqualTo(MediaType.TEXT_HTML);
//    }

    @Controller
    @Secured(SecurityRule.IS_ANONYMOUS)
    @Requires(property = "spec.name", value = "ClientForwardControllerIT")
    public static class TestController {

        @Get(value = "/test", produces = MediaType.TEXT_PLAIN)
        public String test() {
            return "test";
        }
    }
}
