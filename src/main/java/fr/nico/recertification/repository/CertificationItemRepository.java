package fr.nico.recertification.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import fr.nico.recertification.domain.CertificationGroup;
import fr.nico.recertification.domain.CertificationItem;


/**
 * Spring Data  repository for the CertificationItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationItemRepository extends JpaRepository<CertificationItem, Long> {
	@Query("SELECT COUNT(CASE WHEN cert_decision = 'revoked' THEN 1 END) AS revoked,"
			+ "COUNT(CASE WHEN cert_decision = 'approved' THEN 1 END) AS approved,"
			+ "COUNT(CASE WHEN cert_decision = null THEN 1 END) AS empty, "
			+ "count(*) as totalCount,  "
			+ "(select count(distinct targetIdentity) from CertificationItem  a  where "
			+ "	((select count(*) from CertificationItem c where certDecision <> null and a.targetIdentity = c.targetIdentity  ) * 100 "
			+ "/ (select count(*) from CertificationItem c where a.targetIdentity = c.targetIdentity ) = 100)) as totalIdentityReviewed, "
			+ "(select count(distinct targetIdentity) from CertificationItem c ) as totalIdentities "
			+ "From CertificationItem c")
	Optional<Map> countStatus();
	
	@Query(value="SELECT distinct TARGET_IDENTITY as identities from certification_item c  ",nativeQuery = true)
	Optional<List> listIdentities();
	
	@Query(value="SELECT distinct TARGET_APPLICATION as applications from certification_item c  ",nativeQuery = true)
	Optional<List> listApplications();
	
	Page<CertificationItem> findAllByCertGroup(String certGroupId, Pageable pageable);
	
	
	
}
