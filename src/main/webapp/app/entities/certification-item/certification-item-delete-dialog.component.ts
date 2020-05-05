import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICertificationItem } from 'app/shared/model/certification-item.model';
import { CertificationItemService } from './certification-item.service';

@Component({
  selector: 'jhi-certification-item-delete-dialog',
  templateUrl: './certification-item-delete-dialog.component.html'
})
export class CertificationItemDeleteDialogComponent {
  certificationItem: ICertificationItem;

  constructor(
    protected certificationItemService: CertificationItemService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.certificationItemService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'certificationItemListModification',
        content: 'Deleted an certificationItem'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-certification-item-delete-popup',
  template: ''
})
export class CertificationItemDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationItem }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CertificationItemDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.certificationItem = certificationItem;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/certification-item', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/certification-item', { outlets: { popup: null } }]);
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
