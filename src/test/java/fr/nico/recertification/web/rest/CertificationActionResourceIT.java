package fr.nico.recertification.web.rest;

import fr.nico.recertification.RecertificationAggregatorApp;
import fr.nico.recertification.domain.CertificationAction;
import fr.nico.recertification.repository.CertificationActionRepository;
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
 * Integration tests for the {@Link CertificationActionResource} REST controller.
 */
@SpringBootTest(classes = RecertificationAggregatorApp.class)
public class CertificationActionResourceIT {

    private static final Instant DEFAULT_COMPLETED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_COMPLETED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DECISION = "AAAAAAAAAA";
    private static final String UPDATED_DECISION = "BBBBBBBBBB";

    @Autowired
    private CertificationActionRepository certificationActionRepository;

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

    private MockMvc restCertificationActionMockMvc;

    private CertificationAction certificationAction;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CertificationActionResource certificationActionResource = new CertificationActionResource(certificationActionRepository);
        this.restCertificationActionMockMvc = MockMvcBuilders.standaloneSetup(certificationActionResource)
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
    public static CertificationAction createEntity(EntityManager em) {
        CertificationAction certificationAction = new CertificationAction()
            .completed(DEFAULT_COMPLETED)
            .decision(DEFAULT_DECISION);
        return certificationAction;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationAction createUpdatedEntity(EntityManager em) {
        CertificationAction certificationAction = new CertificationAction()
            .completed(UPDATED_COMPLETED)
            .decision(UPDATED_DECISION);
        return certificationAction;
    }

    @BeforeEach
    public void initTest() {
        certificationAction = createEntity(em);
    }

    @Test
    @Transactional
    public void createCertificationAction() throws Exception {
        int databaseSizeBeforeCreate = certificationActionRepository.findAll().size();

        // Create the CertificationAction
        restCertificationActionMockMvc.perform(post("/api/certification-actions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationAction)))
            .andExpect(status().isCreated());

        // Validate the CertificationAction in the database
        List<CertificationAction> certificationActionList = certificationActionRepository.findAll();
        assertThat(certificationActionList).hasSize(databaseSizeBeforeCreate + 1);
        CertificationAction testCertificationAction = certificationActionList.get(certificationActionList.size() - 1);
        assertThat(testCertificationAction.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testCertificationAction.getDecision()).isEqualTo(DEFAULT_DECISION);
    }

    @Test
    @Transactional
    public void createCertificationActionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = certificationActionRepository.findAll().size();

        // Create the CertificationAction with an existing ID
        certificationAction.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCertificationActionMockMvc.perform(post("/api/certification-actions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationAction)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationAction in the database
        List<CertificationAction> certificationActionList = certificationActionRepository.findAll();
        assertThat(certificationActionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCertificationActions() throws Exception {
        // Initialize the database
        certificationActionRepository.saveAndFlush(certificationAction);

        // Get all the certificationActionList
        restCertificationActionMockMvc.perform(get("/api/certification-actions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(certificationAction.getId().intValue())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.toString())))
            .andExpect(jsonPath("$.[*].decision").value(hasItem(DEFAULT_DECISION.toString())));
    }
    
    @Test
    @Transactional
    public void getCertificationAction() throws Exception {
        // Initialize the database
        certificationActionRepository.saveAndFlush(certificationAction);

        // Get the certificationAction
        restCertificationActionMockMvc.perform(get("/api/certification-actions/{id}", certificationAction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(certificationAction.getId().intValue()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.toString()))
            .andExpect(jsonPath("$.decision").value(DEFAULT_DECISION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCertificationAction() throws Exception {
        // Get the certificationAction
        restCertificationActionMockMvc.perform(get("/api/certification-actions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCertificationAction() throws Exception {
        // Initialize the database
        certificationActionRepository.saveAndFlush(certificationAction);

        int databaseSizeBeforeUpdate = certificationActionRepository.findAll().size();

        // Update the certificationAction
        CertificationAction updatedCertificationAction = certificationActionRepository.findById(certificationAction.getId()).get();
        // Disconnect from session so that the updates on updatedCertificationAction are not directly saved in db
        em.detach(updatedCertificationAction);
        updatedCertificationAction
            .completed(UPDATED_COMPLETED)
            .decision(UPDATED_DECISION);

        restCertificationActionMockMvc.perform(put("/api/certification-actions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCertificationAction)))
            .andExpect(status().isOk());

        // Validate the CertificationAction in the database
        List<CertificationAction> certificationActionList = certificationActionRepository.findAll();
        assertThat(certificationActionList).hasSize(databaseSizeBeforeUpdate);
        CertificationAction testCertificationAction = certificationActionList.get(certificationActionList.size() - 1);
        assertThat(testCertificationAction.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testCertificationAction.getDecision()).isEqualTo(UPDATED_DECISION);
    }

    @Test
    @Transactional
    public void updateNonExistingCertificationAction() throws Exception {
        int databaseSizeBeforeUpdate = certificationActionRepository.findAll().size();

        // Create the CertificationAction

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertificationActionMockMvc.perform(put("/api/certification-actions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationAction)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationAction in the database
        List<CertificationAction> certificationActionList = certificationActionRepository.findAll();
        assertThat(certificationActionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCertificationAction() throws Exception {
        // Initialize the database
        certificationActionRepository.saveAndFlush(certificationAction);

        int databaseSizeBeforeDelete = certificationActionRepository.findAll().size();

        // Delete the certificationAction
        restCertificationActionMockMvc.perform(delete("/api/certification-actions/{id}", certificationAction.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CertificationAction> certificationActionList = certificationActionRepository.findAll();
        assertThat(certificationActionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CertificationAction.class);
        CertificationAction certificationAction1 = new CertificationAction();
        certificationAction1.setId(1L);
        CertificationAction certificationAction2 = new CertificationAction();
        certificationAction2.setId(certificationAction1.getId());
        assertThat(certificationAction1).isEqualTo(certificationAction2);
        certificationAction2.setId(2L);
        assertThat(certificationAction1).isNotEqualTo(certificationAction2);
        certificationAction1.setId(null);
        assertThat(certificationAction1).isNotEqualTo(certificationAction2);
    }
}
