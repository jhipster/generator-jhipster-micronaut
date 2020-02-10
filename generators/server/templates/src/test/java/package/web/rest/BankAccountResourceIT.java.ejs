package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.domain.BankAccount;
import io.github.jhipster.sample.repository.BankAccountRepository;
import io.micronaut.context.annotation.Property;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.client.RxHttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.test.annotation.MicronautTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import javax.inject.Inject;
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Integration tests for the {@Link BankAccountResource} REST controller.
 */
@MicronautTest(transactional = false)
@Property(name = "micronaut.security.enabled", value = "false")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BankAccountResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_BALANCE = new BigDecimal(1.00);
    private static final BigDecimal UPDATED_BALANCE = new BigDecimal(2);

    @Inject
    private BankAccountRepository bankAccountRepository;

    @Inject @Client("/")
    RxHttpClient client;

    private BankAccount bankAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankAccount createEntity() {
        BankAccount bankAccount = new BankAccount();
        bankAccount.setName(DEFAULT_NAME);
        bankAccount.setBalance(DEFAULT_BALANCE);
        return bankAccount;
    }

    @BeforeEach
    public void initTest() {
        bankAccount = createEntity();
    }

    @AfterEach
    public void cleanUpTest() {
        bankAccountRepository.deleteAll();
    }

    @Test
    public void createBankAccount() {
        long databaseSizeBeforeCreate = bankAccountRepository.count();

        // Create the BankAccount
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.POST("/api/bank-accounts", bankAccount), BankAccount.class).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.CREATED.getCode());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList.size()).isEqualTo(databaseSizeBeforeCreate + 1);
        BankAccount testBankAccount = bankAccountList.get(bankAccountList.size() - 1);
        assertThat(testBankAccount.getName()).isEqualTo(DEFAULT_NAME);
        assertEquals(testBankAccount.getBalance().compareTo(DEFAULT_BALANCE), 0);
    }

    @Test
    public void createBankAccountWithExistingId() {
       long databaseSizeBeforeCreate = bankAccountRepository.count();

        // Create the BankAccount with an existing ID
        bankAccount.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.POST("/api/bank-accounts", bankAccount), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList.size()).isEqualTo(databaseSizeBeforeCreate);
    }

    @Test
    public void checkNameIsRequired() {
        long databaseSizeBeforeCreate = bankAccountRepository.count();
        // set the field null
        bankAccount.setName(null);

        // Create the BankAccount, which fails.
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.POST("/api/bank-accounts", bankAccount), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList.size()).isEqualTo(databaseSizeBeforeCreate);
    }

    @Test
    public void checkBalanceIsRequired() {
        long databaseSizeBeforeCreate = bankAccountRepository.count();
        // set the field null
        bankAccount.setBalance(null);

        // Create the BankAccount, which fails.
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.POST("/api/bank-accounts", bankAccount), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList.size()).isEqualTo(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllBankAccounts() {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList
        List<BankAccount> bankAccounts = client.retrieve(HttpRequest.GET("/api/bank-accounts?sort=id,desc"), Argument.listOf(BankAccount.class)).blockingFirst();

        assertThat(bankAccounts.get(0).getName()).isEqualTo(DEFAULT_NAME);
        assertEquals(bankAccounts.get(0).getBalance().compareTo(DEFAULT_BALANCE), 0);
    }

    @Test
    public void getBankAccount() {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get the bankAccount
        BankAccount bankAccount = client.retrieve(HttpRequest.GET("/api/bank-accounts/" + this.bankAccount.getId()), BankAccount.class).blockingFirst();

        assertThat(bankAccount.getName()).isEqualTo(DEFAULT_NAME);
        assertEquals(bankAccount.getBalance().compareTo(DEFAULT_BALANCE), 0);
    }

    @Test
    public void getNonExistingBankAccount() {
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.GET("/api/bank-accounts/"+ Long.MAX_VALUE), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.NOT_FOUND.getCode());
    }

    @Test
    public void updateBankAccount() {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        int databaseSizeBeforeUpdate = bankAccountRepository.findAll().size();

        // Update the bankAccount
        BankAccount updatedBankAccount = bankAccountRepository.findById(bankAccount.getId()).get();
        updatedBankAccount.setName(UPDATED_NAME);
        updatedBankAccount.setBalance(UPDATED_BALANCE);

        HttpResponse<BankAccount> response = client.exchange(HttpRequest.PUT("/api/bank-accounts", updatedBankAccount), BankAccount.class).onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.OK.getCode());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeUpdate);
        BankAccount testBankAccount = bankAccountList.get(bankAccountList.size() - 1);
        assertThat(testBankAccount.getName()).isEqualTo(UPDATED_NAME);
        assertEquals(testBankAccount.getBalance().compareTo(UPDATED_BALANCE), 0);
    }

    @Test
    public void updateNonExistingBankAccount() {
        int databaseSizeBeforeUpdate = bankAccountRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.PUT("/api/bank-accounts", bankAccount), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        assertThat(response.status().getCode()).isEqualTo(HttpStatus.BAD_REQUEST.getCode());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    public void deleteBankAccount() {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        int databaseSizeBeforeDelete = bankAccountRepository.findAll().size();

        // Delete the bankAccount
        HttpResponse<BankAccount> response = client.exchange(HttpRequest.DELETE("/api/bank-accounts/"+ bankAccount.getId()), BankAccount.class)
            .onErrorReturn(t -> (HttpResponse<BankAccount>) ((HttpClientResponseException) t).getResponse()).blockingFirst();

        // Validate the database is empty
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BankAccount.class);
        BankAccount bankAccount1 = new BankAccount();
        bankAccount1.setId(1L);
        BankAccount bankAccount2 = new BankAccount();
        bankAccount2.setId(bankAccount1.getId());
        assertThat(bankAccount1).isEqualTo(bankAccount2);
        bankAccount2.setId(2L);
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);
        bankAccount1.setId(null);
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);
    }
}
