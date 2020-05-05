import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICertificationAction } from 'app/shared/model/certification-action.model';
import { CertificationActionService } from './certification-action.service';

@Component({
  selector: 'jhi-certification-action-delete-dialog',
  templateUrl: './certification-action-delete-dialog.component.html'
})
export class CertificationActionDeleteDialogComponent {
  certificationAction: ICertificationAction;

  constructor(
    protected certificationActionService: CertificationActionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.certificationActionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'certificationActionListModification',
        content: 'Deleted an certificationAction'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-certification-action-delete-popup',
  template: ''
})
export class CertificationActionDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationAction }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CertificationActionDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.certificationAction = certificationAction;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/certification-action', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/certification-action', { outlets: { popup: null } }]);
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
