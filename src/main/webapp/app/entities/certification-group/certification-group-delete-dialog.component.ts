import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICertificationGroup } from 'app/shared/model/certification-group.model';
import { CertificationGroupService } from './certification-group.service';

@Component({
  selector: 'jhi-certification-group-delete-dialog',
  templateUrl: './certification-group-delete-dialog.component.html'
})
export class CertificationGroupDeleteDialogComponent {
  certificationGroup: ICertificationGroup;

  constructor(
    protected certificationGroupService: CertificationGroupService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.certificationGroupService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'certificationGroupListModification',
        content: 'Deleted an certificationGroup'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-certification-group-delete-popup',
  template: ''
})
export class CertificationGroupDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationGroup }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CertificationGroupDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.certificationGroup = certificationGroup;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/certification-group', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/certification-group', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
