package fr.nico.recertification.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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

import fr.nico.recertification.domain.CertificationItem;
import fr.nico.recertification.repository.CertificationItemRepository;
import fr.nico.recertification.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.nico.recertification.domain.CertificationItem}.
 */
@RestController
@RequestMapping("/api")
public class CertificationItemResource {

    private final Logger log = LoggerFactory.getLogger(CertificationItemResource.class);

    private static final String ENTITY_NAME = "certificationItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CertificationItemRepository certificationItemRepository;

    public CertificationItemResource(CertificationItemRepository certificationItemRepository) {
        this.certificationItemRepository = certificationItemRepository;
    }

    /**
     * {@code POST  /certification-items} : Create a new certificationItem.
     *
     * @param certificationItem the certificationItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new certificationItem, or with status {@code 400 (Bad Request)} if the certificationItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/certification-items")
    public ResponseEntity<CertificationItem> createCertificationItem(@RequestBody CertificationItem certificationItem) throws URISyntaxException {
        log.debug("REST request to save CertificationItem : {}", certificationItem);
        if (certificationItem.getId() != null) {
            throw new BadRequestAlertException("A new certificationItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CertificationItem result = certificationItemRepository.save(certificationItem);
        return ResponseEntity.created(new URI("/api/certification-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /certification-items} : Updates an existing certificationItem.
     *
     * @param certificationItem the certificationItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certificationItem,
     * or with status {@code 400 (Bad Request)} if the certificationItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the certificationItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/certification-items")
    public ResponseEntity<CertificationItem> updateCertificationItem(@RequestBody CertificationItem certificationItem) throws URISyntaxException {
        log.debug("REST request to update CertificationItem : {}", certificationItem);
        if (certificationItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CertificationItem result = certificationItemRepository.save(certificationItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certificationItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /certification-items} : get all the certificationItems.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of certificationItems in body.
     */
    @GetMapping("/certification-items")
    public ResponseEntity<List<CertificationItem>> getAllCertificationItems(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of CertificationItems");
        Page<CertificationItem> page = certificationItemRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /certification-items/:id} : get the "id" certificationItem.
     *
     * @param id the id of the certificationItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the certificationItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/certification-items/{id}")
    public ResponseEntity<CertificationItem> getCertificationItem(@PathVariable Long id) {
        log.debug("REST request to get CertificationItem : {}", id);
        Optional<CertificationItem> certificationItem = certificationItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(certificationItem);
    }
    
    @GetMapping("/certification-items/statistics")
    public ResponseEntity<Map> getStatistics() {
        log.debug("REST request to get CertificationItem statistics");
        Optional<Map> stats = certificationItemRepository.countStatus();
        return ResponseUtil.wrapOrNotFound(stats);
    }

    /**
     * {@code DELETE  /certification-items/:id} : delete the "id" certificationItem.
     *
     * @param id the id of the certificationItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/certification-items/{id}")
    public ResponseEntity<Void> deleteCertificationItem(@PathVariable Long id) {
        log.debug("REST request to delete CertificationItem : {}", id);
        certificationItemRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
