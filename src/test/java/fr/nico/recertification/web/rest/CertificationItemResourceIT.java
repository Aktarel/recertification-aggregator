package fr.nico.recertification.web.rest;

import fr.nico.recertification.RecertificationAggregatorApp;
import fr.nico.recertification.domain.CertificationItem;
import fr.nico.recertification.repository.CertificationItemRepository;
import fr.nico.recertification.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static fr.nico.recertification.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link CertificationItemResource} REST controller.
 */
@SpringBootTest(classes = RecertificationAggregatorApp.class)
public class CertificationItemResourceIT {

    private static final String DEFAULT_TARGET_ASSET = "AAAAAAAAAA";
    private static final String UPDATED_TARGET_ASSET = "BBBBBBBBBB";

    private static final String DEFAULT_TARGET_IDENTITY = "AAAAAAAAAA";
    private static final String UPDATED_TARGET_IDENTITY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ACCOUNT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    @Autowired
    private CertificationItemRepository certificationItemRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCertificationItemMockMvc;

    private CertificationItem certificationItem;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CertificationItemResource certificationItemResource = new CertificationItemResource(certificationItemRepository);
        this.restCertificationItemMockMvc = MockMvcBuilders.standaloneSetup(certificationItemResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationItem createEntity(EntityManager em) {
        CertificationItem certificationItem = new CertificationItem()
            .targetAsset(DEFAULT_TARGET_ASSET)
            .targetIdentity(DEFAULT_TARGET_IDENTITY)
            .created(DEFAULT_CREATED)
            .accountName(DEFAULT_ACCOUNT_NAME)
            .status(DEFAULT_STATUS);
        return certificationItem;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationItem createUpdatedEntity(EntityManager em) {
        CertificationItem certificationItem = new CertificationItem()
            .targetAsset(UPDATED_TARGET_ASSET)
            .targetIdentity(UPDATED_TARGET_IDENTITY)
            .created(UPDATED_CREATED)
            .accountName(UPDATED_ACCOUNT_NAME)
            .status(UPDATED_STATUS);
        return certificationItem;
    }

    @BeforeEach
    public void initTest() {
        certificationItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createCertificationItem() throws Exception {
        int databaseSizeBeforeCreate = certificationItemRepository.findAll().size();

        // Create the CertificationItem
        restCertificationItemMockMvc.perform(post("/api/certification-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationItem)))
            .andExpect(status().isCreated());

        // Validate the CertificationItem in the database
        List<CertificationItem> certificationItemList = certificationItemRepository.findAll();
        assertThat(certificationItemList).hasSize(databaseSizeBeforeCreate + 1);
        CertificationItem testCertificationItem = certificationItemList.get(certificationItemList.size() - 1);
        assertThat(testCertificationItem.getTargetAsset()).isEqualTo(DEFAULT_TARGET_ASSET);
        assertThat(testCertificationItem.getTargetIdentity()).isEqualTo(DEFAULT_TARGET_IDENTITY);
        assertThat(testCertificationItem.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testCertificationItem.getAccountName()).isEqualTo(DEFAULT_ACCOUNT_NAME);
        assertThat(testCertificationItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createCertificationItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = certificationItemRepository.findAll().size();

        // Create the CertificationItem with an existing ID
        certificationItem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCertificationItemMockMvc.perform(post("/api/certification-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationItem)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationItem in the database
        List<CertificationItem> certificationItemList = certificationItemRepository.findAll();
        assertThat(certificationItemList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCertificationItems() throws Exception {
        // Initialize the database
        certificationItemRepository.saveAndFlush(certificationItem);

        // Get all the certificationItemList
        restCertificationItemMockMvc.perform(get("/api/certification-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(certificationItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].targetAsset").value(hasItem(DEFAULT_TARGET_ASSET.toString())))
            .andExpect(jsonPath("$.[*].targetIdentity").value(hasItem(DEFAULT_TARGET_IDENTITY.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].accountName").value(hasItem(DEFAULT_ACCOUNT_NAME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getCertificationItem() throws Exception {
        // Initialize the database
        certificationItemRepository.saveAndFlush(certificationItem);

        // Get the certificationItem
        restCertificationItemMockMvc.perform(get("/api/certification-items/{id}", certificationItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(certificationItem.getId().intValue()))
            .andExpect(jsonPath("$.targetAsset").value(DEFAULT_TARGET_ASSET.toString()))
            .andExpect(jsonPath("$.targetIdentity").value(DEFAULT_TARGET_IDENTITY.toString()))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.accountName").value(DEFAULT_ACCOUNT_NAME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCertificationItem() throws Exception {
        // Get the certificationItem
        restCertificationItemMockMvc.perform(get("/api/certification-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCertificationItem() throws Exception {
        // Initialize the database
        certificationItemRepository.saveAndFlush(certificationItem);

        int databaseSizeBeforeUpdate = certificationItemRepository.findAll().size();

        // Update the certificationItem
        CertificationItem updatedCertificationItem = certificationItemRepository.findById(certificationItem.getId()).get();
        // Disconnect from session so that the updates on updatedCertificationItem are not directly saved in db
        em.detach(updatedCertificationItem);
        updatedCertificationItem
            .targetAsset(UPDATED_TARGET_ASSET)
            .targetIdentity(UPDATED_TARGET_IDENTITY)
            .created(UPDATED_CREATED)
            .accountName(UPDATED_ACCOUNT_NAME)
            .status(UPDATED_STATUS);

        restCertificationItemMockMvc.perform(put("/api/certification-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCertificationItem)))
            .andExpect(status().isOk());

        // Validate the CertificationItem in the database
        List<CertificationItem> certificationItemList = certificationItemRepository.findAll();
        assertThat(certificationItemList).hasSize(databaseSizeBeforeUpdate);
        CertificationItem testCertificationItem = certificationItemList.get(certificationItemList.size() - 1);
        assertThat(testCertificationItem.getTargetAsset()).isEqualTo(UPDATED_TARGET_ASSET);
        assertThat(testCertificationItem.getTargetIdentity()).isEqualTo(UPDATED_TARGET_IDENTITY);
        assertThat(testCertificationItem.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testCertificationItem.getAccountName()).isEqualTo(UPDATED_ACCOUNT_NAME);
        assertThat(testCertificationItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingCertificationItem() throws Exception {
        int databaseSizeBeforeUpdate = certificationItemRepository.findAll().size();

        // Create the CertificationItem

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertificationItemMockMvc.perform(put("/api/certification-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationItem)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationItem in the database
        List<CertificationItem> certificationItemList = certificationItemRepository.findAll();
        assertThat(certificationItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCertificationItem() throws Exception {
        // Initialize the database
        certificationItemRepository.saveAndFlush(certificationItem);

        int databaseSizeBeforeDelete = certificationItemRepository.findAll().size();

        // Delete the certificationItem
        restCertificationItemMockMvc.perform(delete("/api/certification-items/{id}", certificationItem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CertificationItem> certificationItemList = certificationItemRepository.findAll();
        assertThat(certificationItemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CertificationItem.class);
        CertificationItem certificationItem1 = new CertificationItem();
        certificationItem1.setId(1L);
        CertificationItem certificationItem2 = new CertificationItem();
        certificationItem2.setId(certificationItem1.getId());
        assertThat(certificationItem1).isEqualTo(certificationItem2);
        certificationItem2.setId(2L);
        assertThat(certificationItem1).isNotEqualTo(certificationItem2);
        certificationItem1.setId(null);
        assertThat(certificationItem1).isNotEqualTo(certificationItem2);
    }
}
