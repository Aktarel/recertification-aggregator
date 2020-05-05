package fr.nico.recertification.repository;

import fr.nico.recertification.domain.CertificationGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CertificationGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationGroupRepository extends JpaRepository<CertificationGroup, Long> {

}
