package fr.nico.recertification.domain;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * Represent a certication containing certification items to be reviewed
 * @author nicolas
 */
@ApiModel(description = "Represent a certication containing certification items to be reviewed @author nicolas")
@Entity
@Table(name = "certification_group")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class CertificationGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "system_name")
    private String systemName;

    @Column(name = "access_review_name")
    private String accessReviewName;

    @Column(name = "jhi_create")
    private Instant create;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "status")
    private String status;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSystemName() {
        return systemName;
    }

    public CertificationGroup systemName(String systemName) {
        this.systemName = systemName;
        return this;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getAccessReviewName() {
        return accessReviewName;
    }

    public CertificationGroup accessReviewName(String accessReviewName) {
        this.accessReviewName = accessReviewName;
        return this;
    }

    public void setAccessReviewName(String accessReviewName) {
        this.accessReviewName = accessReviewName;
    }

    public Instant getCreate() {
        return create;
    }

    public CertificationGroup create(Instant create) {
        this.create = create;
        return this;
    }

    public void setCreate(Instant create) {
        this.create = create;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public CertificationGroup ownerName(String ownerName) {
        this.ownerName = ownerName;
        return this;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getStatus() {
        return status;
    }

    public CertificationGroup status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CertificationGroup)) {
            return false;
        }
        return id != null && id.equals(((CertificationGroup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CertificationGroup{" +
            "id=" + getId() +
            ", systemName='" + getSystemName() + "'" +
            ", accessReviewName='" + getAccessReviewName() + "'" +
            ", create='" + getCreate() + "'" +
            ", ownerName='" + getOwnerName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
