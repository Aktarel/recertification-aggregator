import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICertificationAction } from 'app/shared/model/certification-action.model';
import { AccountService } from 'app/core';
import { CertificationActionService } from './certification-action.service';

@Component({
  selector: 'jhi-certification-action',
  templateUrl: './certification-action.component.html'
})
export class CertificationActionComponent implements OnInit, OnDestroy {
  certificationActions: ICertificationAction[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected certificationActionService: CertificationActionService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.certificationActionService
      .query()
      .pipe(
        filter((res: HttpResponse<ICertificationAction[]>) => res.ok),
        map((res: HttpResponse<ICertificationAction[]>) => res.body)
      )
      .subscribe(
        (res: ICertificationAction[]) => {
          this.certificationActions = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCertificationActions();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICertificationAction) {
    return item.id;
  }

  registerChangeInCertificationActions() {
    this.eventSubscriber = this.eventManager.subscribe('certificationActionListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
