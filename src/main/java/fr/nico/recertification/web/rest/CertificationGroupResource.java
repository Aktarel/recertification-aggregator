package fr.nico.recertification.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import fr.nico.recertification.domain.CertificationGroup;
import fr.nico.recertification.repository.CertificationGroupRepository;
import fr.nico.recertification.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.nico.recertification.domain.CertificationGroup}.
 */
@RestController
@RequestMapping("/api")
public class CertificationGroupResource {

    private final Logger log = LoggerFactory.getLogger(CertificationGroupResource.class);

    private static final String ENTITY_NAME = "certificationGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CertificationGroupRepository certificationGroupRepository;

    public CertificationGroupResource(CertificationGroupRepository certificationGroupRepository) {
        this.certificationGroupRepository = certificationGroupRepository;
    }

    /**
     * {@code POST  /certification-groups} : Create a new certificationGroup.
     *
     * @param certificationGroup the certificationGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new certificationGroup, or with status {@code 400 (Bad Request)} if the certificationGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/certification-groups")
    public ResponseEntity<CertificationGroup> createCertificationGroup(@RequestBody CertificationGroup certificationGroup) throws URISyntaxException {
        log.debug("REST request to save CertificationGroup : {}", certificationGroup);
        if (certificationGroup.getId() != null) {
            throw new BadRequestAlertException("A new certificationGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CertificationGroup result = certificationGroupRepository.save(certificationGroup);
        return ResponseEntity.created(new URI("/api/certification-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /certification-groups} : Updates an existing certificationGroup.
     *
     * @param certificationGroup the certificationGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certificationGroup,
     * or with status {@code 400 (Bad Request)} if the certificationGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the certificationGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/certification-groups")
    public ResponseEntity<CertificationGroup> updateCertificationGroup(@RequestBody CertificationGroup certificationGroup) throws URISyntaxException {
        log.debug("REST request to update CertificationGroup : {}", certificationGroup);
        if (certificationGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CertificationGroup result = certificationGroupRepository.save(certificationGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certificationGroup.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /certification-groups} : get all the certificationGroups.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of certificationGroups in body.
     */
    @GetMapping("/certification-groups/all")
    public ResponseEntity<List<CertificationGroup>> getAllCertificationGroups(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
    	log.debug("REST request to get a page of CertificationGroups");
        Page<CertificationGroup> page = certificationGroupRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    @GetMapping("/certification-groups")
    public ResponseEntity<List<CertificationGroup>> getAllCertificationGroupsByLogin(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
    	log.debug("REST request to get a page of CertificationGroupsByLogin");
    	Authentication auth= SecurityContextHolder.getContext().getAuthentication();
    	UserDetails principal= (UserDetails) ((UsernamePasswordAuthenticationToken)auth).getPrincipal(); 
        Page<CertificationGroup> page = certificationGroupRepository.findAllByOwnerName(principal.getUsername(),pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    /**
     * {@code GET  /certification-groups/:id} : get the "id" certificationGroup.
     *
     * @param id the id of the certificationGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the certificationGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/certification-groups/{id}")
    public ResponseEntity<CertificationGroup> getCertificationGroup(@PathVariable Long id) {
        log.debug("REST request to get CertificationGroup : {}", id);
        Optional<CertificationGroup> certificationGroup = certificationGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(certificationGroup);
    }

    /**
     * {@code DELETE  /certification-groups/:id} : delete the "id" certificationGroup.
     *
     * @param id the id of the certificationGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/certification-groups/{id}")
    public ResponseEntity<Void> deleteCertificationGroup(@PathVariable Long id) {
        log.debug("REST request to delete CertificationGroup : {}", id);
        certificationGroupRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
