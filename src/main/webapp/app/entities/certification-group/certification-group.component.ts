import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ICertificationGroup } from 'app/shared/model/certification-group.model';
import { AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { CertificationGroupService } from './certification-group.service';

@Component({
  selector: 'jhi-certification-group',
  templateUrl: './certification-group.component.html'
})
export class CertificationGroupComponent implements OnInit, OnDestroy {
  certificationGroups: ICertificationGroup[];
  currentAccount: any;
  eventSubscriber: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  reverse: any;
  totalItems: number;

  constructor(
    protected certificationGroupService: CertificationGroupService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected parseLinks: JhiParseLinks,
    protected accountService: AccountService
  ) {
    this.certificationGroups = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.reverse = true;
  }

  loadAll() {
    let login = this.accountService.getAuthenticateUser();
    let hasAuthority = this.accountService.hasAnyAuthority(['ROLE_ADMIN']);

    if (hasAuthority) {
      this.certificationGroupService
        .query({
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: HttpResponse<ICertificationGroup[]>) => this.paginateCertificationGroups(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message)
        );
    } else if (this.accountService.hasAnyAuthority(['ROLE_USER'])) {
      this.certificationGroupService
        .queryByLogin({
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: HttpResponse<ICertificationGroup[]>) => this.paginateCertificationGroupsPerUid(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
  }

  reset() {
    this.page = 0;
    this.certificationGroups = [];
    this.loadAll();
  }

  loadPage(page) {
    this.page = page;
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCertificationGroups();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICertificationGroup) {
    return item.id;
  }

  registerChangeInCertificationGroups() {
    this.eventSubscriber = this.eventManager.subscribe('certificationGroupListModification', response => this.reset());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCertificationGroups(data: ICertificationGroup[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    for (let i = 0; i < data.length; i++) {
      this.certificationGroups.push(data[i]);
    }
  }
  protected paginateCertificationGroupsPerUid(data: ICertificationGroup[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    for (let i = 0; i < data.length; i++) {
      this.certificationGroups.push(data[i]);
    }
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
