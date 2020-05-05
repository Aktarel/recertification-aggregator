package fr.nico.recertification.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * Represent certification action containing the decision on the item
 * Approve / Revok
 * Null = Undecided
 * @author nicolas
 */
@ApiModel(description = "Represent certification action containing the decision on the item Approve / Revok Null = Undecided @author nicolas")
@Entity
@Table(name = "certification_action")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class CertificationAction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "completed")
    private Instant completed;

    @Column(name = "decision")
    private String decision;

    @ManyToOne
    @JsonIgnoreProperties("certificationActions")
    private CertificationItem action;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCompleted() {
        return completed;
    }

    public CertificationAction completed(Instant completed) {
        this.completed = completed;
        return this;
    }

    public void setCompleted(Instant completed) {
        this.completed = completed;
    }

    public String getDecision() {
        return decision;
    }

    public CertificationAction decision(String decision) {
        this.decision = decision;
        return this;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public CertificationItem getAction() {
        return action;
    }

    public CertificationAction action(CertificationItem certificationItem) {
        this.action = certificationItem;
        return this;
    }

    public void setAction(CertificationItem certificationItem) {
        this.action = certificationItem;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CertificationAction)) {
            return false;
        }
        return id != null && id.equals(((CertificationAction) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CertificationAction{" +
            "id=" + getId() +
            ", completed='" + getCompleted() + "'" +
            ", decision='" + getDecision() + "'" +
            "}";
    }
}
