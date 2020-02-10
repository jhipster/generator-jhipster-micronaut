package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.JhipsterSampleApplicationApp;
import io.github.jhipster.sample.config.Constants;
import io.github.jhipster.sample.domain.Authority;
import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.repository.AuthorityRepository;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.security.AuthoritiesConstants;
import io.github.jhipster.sample.service.MailService;
import io.github.jhipster.sample.service.UserService;
import io.github.jhipster.sample.service.dto.PasswordChangeDTO;
import io.github.jhipster.sample.service.dto.UserDTO;
import io.github.jhipster.sample.web.rest.vm.ManagedUserVM;
import io.micronaut.context.annotation.Property;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.client.RxHttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.security.authentication.providers.PasswordEncoder;
import io.micronaut.test.annotation.MicronautTest;
import io.micronaut.test.annotation.MockBean;
import org.apache.commons.lang3.RandomStringUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@MicronautTest(application = JhipsterSampleApplicationApp.class, transactional = false)
@Property(name = "micronaut.security.enabled", value = "false")
public class AccountResourceIT {

    @Inject UserRepository userRepository;
    @Inject AuthorityRepository authorityRepository;
    @Inject UserService userService;
    @Inject PasswordEncoder passwordEncoder;
    @Inject MailService mailService;
    @Inject @Client("/") RxHttpClient client;

    @MockBean(UserService.class)
    UserService userService() {
        return mock(UserService.class);
    }

    @MockBean(MailService.class)
    MailService mailService() {
        return mock(MailService.class);
    }

    @BeforeEach
    public void setup() {
        doNothing().when(mailService).sendActivationEmail(any());
    }

    @Test
    public void testNonAuthenticatedUser()  {
        HttpClientResponseException ex = Assertions.catchThrowableOfType(() -> {
            client.exchange(HttpRequest.GET("/api/authenticate").accept(MediaType.APPLICATION_JSON_TYPE), String.class).blockingFirst();
        }, HttpClientResponseException.class);

        assertThat(ex.getResponse().status().getCode()).isEqualTo(HttpStatus.NOT_FOUND.getCode());
    }

    @Test
    public void testGetExistingAccount()  {
        Set<Authority> authorities = new HashSet<>();
        Authority authority = new Authority();
        authority.setName(AuthoritiesConstants.ADMIN);
        authorities.add(authority);

        User user = new User();
        user.setLogin("test");
        user.setFirstName("john");
        user.setLastName("doe");
        user.setEmail("john.doe@jhipster.com");
        user.setImageUrl("http://placehold.it/50x50");
        user.setLangKey("en");
        user.setAuthorities(authorities);
        when(userService.getUserWithAuthorities()).thenReturn(Optional.of(user));

        UserDTO userDTO = client.retrieve(HttpRequest.GET("/api/account"), UserDTO.class).blockingFirst();

        assertThat(userDTO.getLogin()).isEqualTo("test");
        assertThat(userDTO.getFirstName()).isEqualTo("john");
        assertThat(userDTO.getLastName()).isEqualTo("doe");
        assertThat(userDTO.getEmail()).isEqualTo("john.doe@jhipster.com");
        assertThat(userDTO.getImageUrl()).isEqualTo("http://placehold.it/50x50");
        assertThat(userDTO.getAuthorities().toString()).isEqualTo("[ROLE_ADMIN]");
    }


    @Test
    public void testGetUnknownAccount()  {
        when(userService.getUserWithAuthorities()).thenReturn(Optional.empty());

        HttpResponse<String> response = client.exchange(HttpRequest.GET("/api/account"), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.getCode());
    }


    @Test
    public void testRegisterValid()  {
        ManagedUserVM validUser = new ManagedUserVM();
        validUser.setLogin("test-register-valid");
        validUser.setPassword("password");
        validUser.setFirstName("Alice");
        validUser.setLastName("Test");
        validUser.setEmail("test-register-valid@example.com");
        validUser.setImageUrl("http://placehold.it/50x50");
        validUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        validUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));
        assertThat(userRepository.findOneByLogin("test-register-valid").isPresent()).isFalse();

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/register", validUser), String.class).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.CREATED.getCode());
    }


    @Test
    public void testRegisterInvalidLogin()  {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("funky-log!n");// <-- invalid
        invalidUser.setPassword("password");
        invalidUser.setFirstName("Funky");
        invalidUser.setLastName("One");
        invalidUser.setEmail("funky@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/register", invalidUser), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        Optional<User> user = userRepository.findOneByEmailIgnoreCase("funky@example.com");
        assertThat(user.isPresent()).isFalse();
    }


    @Test
    public void testRegisterInvalidEmail()  {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword("password");
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("invalid");// <-- invalid
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/register", invalidUser), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        Optional<User> user = userRepository.findOneByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }


    @Test
    public void testRegisterInvalidPassword()  {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword("123");// password with only 3 digits
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("bob@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/register", invalidUser), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        Optional<User> user = userRepository.findOneByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }


    @Test
    public void testRegisterNullPassword()  {
        ManagedUserVM invalidUser = new ManagedUserVM();
        invalidUser.setLogin("bob");
        invalidUser.setPassword(null);// invalid null password
        invalidUser.setFirstName("Bob");
        invalidUser.setLastName("Green");
        invalidUser.setEmail("bob@example.com");
        invalidUser.setActivated(true);
        invalidUser.setImageUrl("http://placehold.it/50x50");
        invalidUser.setLangKey(Constants.DEFAULT_LANGUAGE);
        invalidUser.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/register", invalidUser), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.getCode());

        Optional<User> user = userRepository.findOneByLogin("bob");
        assertThat(user.isPresent()).isFalse();
    }


    @Test
    public void testSaveAccount()  {
        when(userService.getCurrentUserLogin()).thenReturn(Optional.of("save-account"));
        User user = new User();
        user.setLogin("save-account");
        user.setEmail("save-account@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);

        userRepository.saveAndFlush(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-account@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account", userDTO), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        verify(userService, times(1)).updateUser("firstname", "lastname",
            "save-account@example.com", "en", "http://placehold.it/50x50");
    }

    @Test
    public void testSaveInvalidEmail()  {
        when(userService.getCurrentUserLogin()).thenReturn(Optional.of("save-invalid-email"));
        User user = new User();
        user.setLogin("save-invalid-email");
        user.setEmail("save-invalid-email@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);

        userRepository.saveAndFlush(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("invalid email");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account", userDTO), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        assertThat(userRepository.findOneByEmailIgnoreCase("invalid email")).isNotPresent();
    }

    @Test
    public void testSaveExistingEmail()  {
        when(userService.getCurrentUserLogin()).thenReturn(Optional.of("save-existing-email"));
        User user = new User();
        user.setLogin("save-existing-email");
        user.setEmail("save-existing-email@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);

        userRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("save-existing-email2");
        anotherUser.setEmail("save-existing-email2@example.com");
        anotherUser.setPassword(RandomStringUtils.random(60));
        anotherUser.setActivated(true);

        userRepository.saveAndFlush(anotherUser);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-existing-email2@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account", userDTO), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        User updatedUser = userRepository.findOneByLogin("save-existing-email").orElse(null);
        assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email@example.com");
    }


    @Test
    public void testSaveExistingEmailAndLogin()  {
        when(userService.getCurrentUserLogin()).thenReturn(Optional.of("save-existing-email-and-login"));
        User user = new User();
        user.setLogin("save-existing-email-and-login");
        user.setEmail("save-existing-email-and-login@example.com");
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);

        userRepository.saveAndFlush(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("not-used");
        userDTO.setFirstName("firstname");
        userDTO.setLastName("lastname");
        userDTO.setEmail("save-existing-email-and-login@example.com");
        userDTO.setActivated(false);
        userDTO.setImageUrl("http://placehold.it/50x50");
        userDTO.setLangKey(Constants.DEFAULT_LANGUAGE);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.ADMIN));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account", userDTO), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        verify(userService, times(1)).updateUser("firstname", "lastname",
            "save-existing-email-and-login@example.com", "en", "http://placehold.it/50x50");
        User updatedUser = userRepository.findOneByLogin("save-existing-email-and-login").orElse(null);
        assertThat(updatedUser.getEmail()).isEqualTo("save-existing-email-and-login@example.com");
    }


    @Test
    public void testChangePasswordWrongExistingPassword()  {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password-wrong-existing-password");
        user.setEmail("change-password-wrong-existing-password@example.com");
        userRepository.saveAndFlush(user);

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account/change-password", new PasswordChangeDTO("1"+currentPassword, "new password")), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        verify(userService, times(1)).changePassword(anyString(), eq("new password"));
    }

    @Test
    public void testChangePassword()  {
        User user = new User();
        String currentPassword = RandomStringUtils.random(60);
        user.setPassword(passwordEncoder.encode(currentPassword));
        user.setLogin("change-password");
        user.setEmail("change-password@example.com");
        userRepository.saveAndFlush(user);

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account/change-password", new PasswordChangeDTO(currentPassword, "new password")), String.class).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();;

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        verify(userService, times(1)).changePassword(anyString(), eq("new password"));
    }

    @Test
    public void testRequestPasswordReset()  {
        User user = new User();
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        user.setLogin("password-reset");
        user.setEmail("password-reset@example.com");
        userRepository.saveAndFlush(user);
        when(userService.requestPasswordReset(anyString())).thenReturn(Optional.of(user));

        HttpResponse<String> response = client.exchange(HttpRequest.POST("/api/account/reset-password/init", "{\"mail\":\"password-reset@example.com\"}"), Argument.of(String.class)).
            onErrorReturn(t -> (HttpResponse<String>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());
        verify(userService, times(1)).requestPasswordReset(anyString());
    }
}
