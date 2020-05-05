package fr.nico.recertification.web.rest;

import fr.nico.recertification.domain.CertificationAction;
import fr.nico.recertification.repository.CertificationActionRepository;
import fr.nico.recertification.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link fr.nico.recertification.domain.CertificationAction}.
 */
@RestController
@RequestMapping("/api")
public class CertificationActionResource {

    private final Logger log = LoggerFactory.getLogger(CertificationActionResource.class);

    private static final String ENTITY_NAME = "certificationAction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CertificationActionRepository certificationActionRepository;

    public CertificationActionResource(CertificationActionRepository certificationActionRepository) {
        this.certificationActionRepository = certificationActionRepository;
    }

    /**
     * {@code POST  /certification-actions} : Create a new certificationAction.
     *
     * @param certificationAction the certificationAction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new certificationAction, or with status {@code 400 (Bad Request)} if the certificationAction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/certification-actions")
    public ResponseEntity<CertificationAction> createCertificationAction(@RequestBody CertificationAction certificationAction) throws URISyntaxException {
        log.debug("REST request to save CertificationAction : {}", certificationAction);
        if (certificationAction.getId() != null) {
            throw new BadRequestAlertException("A new certificationAction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CertificationAction result = certificationActionRepository.save(certificationAction);
        return ResponseEntity.created(new URI("/api/certification-actions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /certification-actions} : Updates an existing certificationAction.
     *
     * @param certificationAction the certificationAction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certificationAction,
     * or with status {@code 400 (Bad Request)} if the certificationAction is not valid,
     * or with status {@code 500 (Internal Server Error)} if the certificationAction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/certification-actions")
    public ResponseEntity<CertificationAction> updateCertificationAction(@RequestBody CertificationAction certificationAction) throws URISyntaxException {
        log.debug("REST request to update CertificationAction : {}", certificationAction);
        if (certificationAction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CertificationAction result = certificationActionRepository.save(certificationAction);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certificationAction.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /certification-actions} : get all the certificationActions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of certificationActions in body.
     */
    @GetMapping("/certification-actions")
    public List<CertificationAction> getAllCertificationActions() {
        log.debug("REST request to get all CertificationActions");
        return certificationActionRepository.findAll();
    }

    /**
     * {@code GET  /certification-actions/:id} : get the "id" certificationAction.
     *
     * @param id the id of the certificationAction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the certificationAction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/certification-actions/{id}")
    public ResponseEntity<CertificationAction> getCertificationAction(@PathVariable Long id) {
        log.debug("REST request to get CertificationAction : {}", id);
        Optional<CertificationAction> certificationAction = certificationActionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(certificationAction);
    }

    /**
     * {@code DELETE  /certification-actions/:id} : delete the "id" certificationAction.
     *
     * @param id the id of the certificationAction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/certification-actions/{id}")
    public ResponseEntity<Void> deleteCertificationAction(@PathVariable Long id) {
        log.debug("REST request to delete CertificationAction : {}", id);
        certificationActionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
