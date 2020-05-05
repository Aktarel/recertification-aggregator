package fr.nico.recertification.web.rest;

import fr.nico.recertification.RecertificationAggregatorApp;
import fr.nico.recertification.domain.CertificationGroup;
import fr.nico.recertification.repository.CertificationGroupRepository;
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
 * Integration tests for the {@Link CertificationGroupResource} REST controller.
 */
@SpringBootTest(classes = RecertificationAggregatorApp.class)
public class CertificationGroupResourceIT {

    private static final String DEFAULT_SYSTEM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SYSTEM_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ACCESS_REVIEW_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACCESS_REVIEW_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_OWNER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_OWNER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    @Autowired
    private CertificationGroupRepository certificationGroupRepository;

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

    private MockMvc restCertificationGroupMockMvc;

    private CertificationGroup certificationGroup;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CertificationGroupResource certificationGroupResource = new CertificationGroupResource(certificationGroupRepository);
        this.restCertificationGroupMockMvc = MockMvcBuilders.standaloneSetup(certificationGroupResource)
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
    public static CertificationGroup createEntity(EntityManager em) {
        CertificationGroup certificationGroup = new CertificationGroup()
            .systemName(DEFAULT_SYSTEM_NAME)
            .accessReviewName(DEFAULT_ACCESS_REVIEW_NAME)
            .create(DEFAULT_CREATE)
            .ownerName(DEFAULT_OWNER_NAME)
            .status(DEFAULT_STATUS);
        return certificationGroup;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationGroup createUpdatedEntity(EntityManager em) {
        CertificationGroup certificationGroup = new CertificationGroup()
            .systemName(UPDATED_SYSTEM_NAME)
            .accessReviewName(UPDATED_ACCESS_REVIEW_NAME)
            .create(UPDATED_CREATE)
            .ownerName(UPDATED_OWNER_NAME)
            .status(UPDATED_STATUS);
        return certificationGroup;
    }

    @BeforeEach
    public void initTest() {
        certificationGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createCertificationGroup() throws Exception {
        int databaseSizeBeforeCreate = certificationGroupRepository.findAll().size();

        // Create the CertificationGroup
        restCertificationGroupMockMvc.perform(post("/api/certification-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationGroup)))
            .andExpect(status().isCreated());

        // Validate the CertificationGroup in the database
        List<CertificationGroup> certificationGroupList = certificationGroupRepository.findAll();
        assertThat(certificationGroupList).hasSize(databaseSizeBeforeCreate + 1);
        CertificationGroup testCertificationGroup = certificationGroupList.get(certificationGroupList.size() - 1);
        assertThat(testCertificationGroup.getSystemName()).isEqualTo(DEFAULT_SYSTEM_NAME);
        assertThat(testCertificationGroup.getAccessReviewName()).isEqualTo(DEFAULT_ACCESS_REVIEW_NAME);
        assertThat(testCertificationGroup.getCreate()).isEqualTo(DEFAULT_CREATE);
        assertThat(testCertificationGroup.getOwnerName()).isEqualTo(DEFAULT_OWNER_NAME);
        assertThat(testCertificationGroup.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createCertificationGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = certificationGroupRepository.findAll().size();

        // Create the CertificationGroup with an existing ID
        certificationGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCertificationGroupMockMvc.perform(post("/api/certification-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationGroup)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationGroup in the database
        List<CertificationGroup> certificationGroupList = certificationGroupRepository.findAll();
        assertThat(certificationGroupList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCertificationGroups() throws Exception {
        // Initialize the database
        certificationGroupRepository.saveAndFlush(certificationGroup);

        // Get all the certificationGroupList
        restCertificationGroupMockMvc.perform(get("/api/certification-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(certificationGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].systemName").value(hasItem(DEFAULT_SYSTEM_NAME.toString())))
            .andExpect(jsonPath("$.[*].accessReviewName").value(hasItem(DEFAULT_ACCESS_REVIEW_NAME.toString())))
            .andExpect(jsonPath("$.[*].create").value(hasItem(DEFAULT_CREATE.toString())))
            .andExpect(jsonPath("$.[*].ownerName").value(hasItem(DEFAULT_OWNER_NAME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getCertificationGroup() throws Exception {
        // Initialize the database
        certificationGroupRepository.saveAndFlush(certificationGroup);

        // Get the certificationGroup
        restCertificationGroupMockMvc.perform(get("/api/certification-groups/{id}", certificationGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(certificationGroup.getId().intValue()))
            .andExpect(jsonPath("$.systemName").value(DEFAULT_SYSTEM_NAME.toString()))
            .andExpect(jsonPath("$.accessReviewName").value(DEFAULT_ACCESS_REVIEW_NAME.toString()))
            .andExpect(jsonPath("$.create").value(DEFAULT_CREATE.toString()))
            .andExpect(jsonPath("$.ownerName").value(DEFAULT_OWNER_NAME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCertificationGroup() throws Exception {
        // Get the certificationGroup
        restCertificationGroupMockMvc.perform(get("/api/certification-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCertificationGroup() throws Exception {
        // Initialize the database
        certificationGroupRepository.saveAndFlush(certificationGroup);

        int databaseSizeBeforeUpdate = certificationGroupRepository.findAll().size();

        // Update the certificationGroup
        CertificationGroup updatedCertificationGroup = certificationGroupRepository.findById(certificationGroup.getId()).get();
        // Disconnect from session so that the updates on updatedCertificationGroup are not directly saved in db
        em.detach(updatedCertificationGroup);
        updatedCertificationGroup
            .systemName(UPDATED_SYSTEM_NAME)
            .accessReviewName(UPDATED_ACCESS_REVIEW_NAME)
            .create(UPDATED_CREATE)
            .ownerName(UPDATED_OWNER_NAME)
            .status(UPDATED_STATUS);

        restCertificationGroupMockMvc.perform(put("/api/certification-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCertificationGroup)))
            .andExpect(status().isOk());

        // Validate the CertificationGroup in the database
        List<CertificationGroup> certificationGroupList = certificationGroupRepository.findAll();
        assertThat(certificationGroupList).hasSize(databaseSizeBeforeUpdate);
        CertificationGroup testCertificationGroup = certificationGroupList.get(certificationGroupList.size() - 1);
        assertThat(testCertificationGroup.getSystemName()).isEqualTo(UPDATED_SYSTEM_NAME);
        assertThat(testCertificationGroup.getAccessReviewName()).isEqualTo(UPDATED_ACCESS_REVIEW_NAME);
        assertThat(testCertificationGroup.getCreate()).isEqualTo(UPDATED_CREATE);
        assertThat(testCertificationGroup.getOwnerName()).isEqualTo(UPDATED_OWNER_NAME);
        assertThat(testCertificationGroup.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingCertificationGroup() throws Exception {
        int databaseSizeBeforeUpdate = certificationGroupRepository.findAll().size();

        // Create the CertificationGroup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertificationGroupMockMvc.perform(put("/api/certification-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(certificationGroup)))
            .andExpect(status().isBadRequest());

        // Validate the CertificationGroup in the database
        List<CertificationGroup> certificationGroupList = certificationGroupRepository.findAll();
        assertThat(certificationGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCertificationGroup() throws Exception {
        // Initialize the database
        certificationGroupRepository.saveAndFlush(certificationGroup);

        int databaseSizeBeforeDelete = certificationGroupRepository.findAll().size();

        // Delete the certificationGroup
        restCertificationGroupMockMvc.perform(delete("/api/certification-groups/{id}", certificationGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CertificationGroup> certificationGroupList = certificationGroupRepository.findAll();
        assertThat(certificationGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CertificationGroup.class);
        CertificationGroup certificationGroup1 = new CertificationGroup();
        certificationGroup1.setId(1L);
        CertificationGroup certificationGroup2 = new CertificationGroup();
        certificationGroup2.setId(certificationGroup1.getId());
        assertThat(certificationGroup1).isEqualTo(certificationGroup2);
        certificationGroup2.setId(2L);
        assertThat(certificationGroup1).isNotEqualTo(certificationGroup2);
        certificationGroup1.setId(null);
        assertThat(certificationGroup1).isNotEqualTo(certificationGroup2);
    }
}
