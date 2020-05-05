package fr.nico.recertification.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * Represent a single item of certification group
 * @author nicolas
 */
@ApiModel(description = "Represent a single item of certification group @author nicolas")
@Entity
@Table(name = "certification_item")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class CertificationItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "target_application")
    private String targetApplicationName;
  
    
    @Column(name = "target_asset")
    private String targetAsset;

    @Column(name = "target_identity")
    private String targetIdentity;

    @Column(name = "created")
    private Instant created;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "status")
    private String status;
    
    @Column(name = "cert_decision")
    private String certDecision; 
  
    @ManyToOne
    @JsonIgnoreProperties("certificationItems")
    private CertificationGroup certItem;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTargetAsset() {
        return targetAsset;
    }

    public CertificationItem targetAsset(String targetAsset) {
        this.targetAsset = targetAsset;
        return this;
    }

    public void setTargetAsset(String targetAsset) {
        this.targetAsset = targetAsset;
    }

    public String getTargetIdentity() {
        return targetIdentity;
    }

    public CertificationItem targetIdentity(String targetIdentity) {
        this.targetIdentity = targetIdentity;
        return this;
    }

    public void setTargetIdentity(String targetIdentity) {
        this.targetIdentity = targetIdentity;
    }

    public Instant getCreated() {
        return created;
    }

    public CertificationItem created(Instant created) {
        this.created = created;
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public String getAccountName() {
        return accountName;
    }

    public CertificationItem accountName(String accountName) {
        this.accountName = accountName;
        return this;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getStatus() {
        return status;
    }

    public CertificationItem status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CertificationGroup getCertItem() {
        return certItem;
    }

    public CertificationItem certItem(CertificationGroup certificationGroup) {
        this.certItem = certificationGroup;
        return this;
    }

    public void setCertItem(CertificationGroup certificationGroup) {
        this.certItem = certificationGroup;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CertificationItem)) {
            return false;
        }
        return id != null && id.equals(((CertificationItem) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CertificationItem{" +
            "id=" + getId() +
            ", targetAsset='" + getTargetAsset() + "'" +
            ", targetIdentity='" + getTargetIdentity() + "'" +
            ", created='" + getCreated() + "'" +
            ", accountName='" + getAccountName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }

	public String getTargetApplicationName() {
		return targetApplicationName;
	}

	public void setTargetApplicationName(String targetApplicationName) {
		this.targetApplicationName = targetApplicationName;
	}

	public String getCertDecision() {
		return certDecision;
	}

	public void setCertDecision(String certDecision) {
		this.certDecision = certDecision;
	}
}
