package fr.nico.recertification.repository;

import fr.nico.recertification.domain.CertificationAction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CertificationAction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationActionRepository extends JpaRepository<CertificationAction, Long> {

}
