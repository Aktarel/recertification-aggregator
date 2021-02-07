package fr.nico.recertification.repository;

import fr.nico.recertification.domain.CertificationGroup;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.sun.security.auth.UserPrincipal;


/**
 * Spring Data  repository for the CertificationGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationGroupRepository extends JpaRepository<CertificationGroup, Long> {

	Page<CertificationGroup> findAllByOwnerName(String uid, Pageable pageable);
	
}
