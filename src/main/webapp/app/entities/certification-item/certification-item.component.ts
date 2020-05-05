import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { ICertificationItem, Statistics } from 'app/shared/model/certification-item.model';
import { AccountService } from 'app/core';
import { FilterPipe } from 'app/shared/util/search.pipe';
import { CountPercentagePipe } from 'app/shared/util/count-percentage.pipe';

import { ITEMS_PER_PAGE } from 'app/shared';
import { CertificationItemService } from './certification-item.service';

@Component({
  selector: 'jhi-certification-item',
  templateUrl: './certification-item.component.html',
  providers: [FilterPipe, CountPercentagePipe]
})
export class CertificationItemComponent implements OnInit, OnDestroy {
  certificationItems: ICertificationItem[];
  currentAccount: any;
  eventSubscriber: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  reverse: any;
  totalItems: number;
  isSaving: boolean;
  stats: Statistics;
  filterStatus: string[];
  entities: any = [];

  constructor(
    protected certificationItemService: CertificationItemService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected parseLinks: JhiParseLinks,
    protected accountService: AccountService,
    protected filterPipe: FilterPipe,
    protected countPercentagePipe: CountPercentagePipe
  ) {
    this.isSaving = false;
    this.certificationItems = [];
    this.stats = {};
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.reverse = true;
    this.filterStatus = [];
    this.entities = [];
  }
  filterOnStatus(status: string, searchString: string) {
    var indexOfStatus = this.filterStatus.indexOf(status);
    if (indexOfStatus == -1) {
      if (status === 'empty') {
        this.filterStatus.push(null);
      } else {
        this.filterStatus.push(status);
      }
    } else {
      this.filterStatus.splice(indexOfStatus, 1);
    }

    this.filterPipe.transform(
      this.certificationItems,
      ['targetApplicationName', 'targetAsset', 'targetIdentity', 'accountName'],
      searchString,
      this.filterStatus
    );
  }

  loadAll() {
    this.updateStatistics();
    this.certificationItemService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<ICertificationItem[]>) => this.paginateCertificationItems(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  reset() {
    this.page = 0;
    this.certificationItems = [];
    this.loadAll();
  }

  loadPage(page) {
    this.page = page;
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.updateStatistics();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCertificationItems();
    this.entities = [
      {
        id: 'p1',
        title: 'Application',
        subcategories: [{ title: 'COKPIT', id: 'app1' }, { title: 'Service Now', id: 'app2' }]
      },
      {
        id: 'p2',
        title: 'Entitlement',
        subcategories: [{ title: 'Administrator', id: 'ent1' }, { title: 'Read Only', id: 'ent2' }]
      },
      {
        id: 'p3',
        title: 'Account',
        subcategories: [{ title: 'c98847', id: 'c98847' }, { title: '544947', id: '544947' }]
      }
    ];
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICertificationItem) {
    return item.id;
  }
  approveAll(searchString: string) {
    console.log('revokeAll');
    this.filterPipe
      .transform(
        this.certificationItems,
        ['targetApplicationName', 'targetAsset', 'targetIdentity', 'accountName'],
        searchString,
        this.filterStatus
      )
      .forEach(element => {
        if (element.certDecision !== 'approved') {
          element.certDecision = 'approved';
        } else {
          element.certDecision = null;
        }
        this.subscribeToSaveResponse(this.certificationItemService.update(element));
      });
  }
  revokeAll(searchString: string) {
    console.log('approveAll');
    this.filterPipe
      .transform(
        this.certificationItems,
        ['targetApplicationName', 'targetAsset', 'targetIdentity', 'accountName'],
        searchString,
        this.filterStatus
      )
      .forEach(element => {
        if (element.certDecision !== 'revoked') {
          element.certDecision = 'revoked';
        } else {
          element.certDecision = null;
        }
        this.subscribeToSaveResponse(this.certificationItemService.update(element));
      });
  }
  approve(element: ICertificationItem) {
    if (element.certDecision !== 'approved') {
      element.certDecision = 'approved';
    } else {
      element.certDecision = null;
    }
    this.subscribeToSaveResponse(this.certificationItemService.update(element));
  }
  revoke(element: ICertificationItem) {
    if (element.certDecision !== 'revoked') {
      element.certDecision = 'revoked';
    } else {
      element.certDecision = null;
    }
    this.subscribeToSaveResponse(this.certificationItemService.update(element));
  }
  registerChangeInCertificationItems() {
    this.eventSubscriber = this.eventManager.subscribe('certificationItemListModification', response => this.reset());
  }

  updateStatistics() {
    this.certificationItemService
      .getStats()
      .subscribe((res: HttpResponse<Statistics>) => this.mapStats(res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  getPercent(count: number, total: number) {
    return this.countPercentagePipe.transform(count, total);
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCertificationItems(data: ICertificationItem[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    for (let i = 0; i < data.length; i++) {
      this.certificationItems.push(data[i]);
    }
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificationItem>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }
  protected onSaveSuccess() {
    this.isSaving = false;
    this.updateStatistics();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected mapStats(res: Statistics) {
    this.stats.approved = res.approved;
    this.stats.revoked = res.revoked;
    this.stats.empty = res.empty;
    this.stats.totalCount = res.totalCount;
  }
}
