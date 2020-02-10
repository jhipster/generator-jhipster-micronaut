package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.JhipsterSampleApplicationApp;
import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.web.rest.vm.LoginVM;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.client.RxHttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.security.authentication.providers.PasswordEncoder;
import io.micronaut.security.token.jwt.render.AccessRefreshToken;
import io.micronaut.test.annotation.MicronautTest;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for the {@link io.micronaut.security.endpoints.LoginController} REST controller.
 */
@MicronautTest(application = JhipsterSampleApplicationApp.class, transactional = false)
public class UserJWTControllerIT {

    @Inject
    PasswordEncoder passwordEncoder;

    @Inject
    UserRepository userRepository;

    @Inject @Client("/")
    RxHttpClient client;

    @Test
    public void testAuthorize() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller");
        user.setEmail("user-jwt-controller@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        user = userRepository.saveAndFlush(user);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller");
        login.setPassword("test");

        HttpResponse<AccessRefreshToken> response = client.exchange(HttpRequest.POST("/api/authenticate", login), AccessRefreshToken.class).blockingFirst();
        AccessRefreshToken token = response.body();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        assertThat(token.getAccessToken()).isNotEmpty();

        userRepository.deleteById(user.getId());
    }

    @Test
    public void testAuthorizeFails() throws Exception {
        LoginVM login = new LoginVM();
        login.setUsername("wrong-user");
        login.setPassword("wrong password");

        HttpResponse<AccessRefreshToken> response = client.exchange(HttpRequest.POST("/api/authenticate", login), AccessRefreshToken.class).onErrorReturn(t -> (HttpResponse<AccessRefreshToken>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        AccessRefreshToken token = response.body();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.UNAUTHORIZED.getCode());
        assertThat(token).isNull();
    }
}
