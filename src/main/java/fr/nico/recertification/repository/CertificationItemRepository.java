package fr.nico.recertification.repository;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fr.nico.recertification.domain.CertificationItem;


/**
 * Spring Data  repository for the CertificationItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationItemRepository extends JpaRepository<CertificationItem, Long> {
	@Query("SELECT COUNT(CASE WHEN cert_decision = 'revoked' THEN 1 END) AS revoked,COUNT(CASE WHEN cert_decision = 'approved' THEN 1 END) AS approved,COUNT(CASE WHEN cert_decision = null THEN 1 END) AS empty, count(*) as totalCount  FROM CertificationItem c")
	Optional<Map> countStatus();
}
