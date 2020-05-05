import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CertificationItem } from 'app/shared/model/certification-item.model';
import { CertificationItemService } from './certification-item.service';
import { CertificationItemComponent } from './certification-item.component';
import { CertificationItemDetailComponent } from './certification-item-detail.component';
import { CertificationItemUpdateComponent } from './certification-item-update.component';

import { CertificationItemDeletePopupComponent } from './certification-item-delete-dialog.component';
import { ICertificationItem } from 'app/shared/model/certification-item.model';

@Injectable({ providedIn: 'root' })
export class CertificationItemResolve implements Resolve<ICertificationItem> {
  constructor(private service: CertificationItemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICertificationItem> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CertificationItem>) => response.ok),
        map((certificationItem: HttpResponse<CertificationItem>) => certificationItem.body)
      );
    }
    return of(new CertificationItem());
  }
}

export const certificationItemRoute: Routes = [
  {
    path: '',
    component: CertificationItemComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CertificationItemDetailComponent,
    resolve: {
      certificationItem: CertificationItemResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CertificationItemUpdateComponent,
    resolve: {
      certificationItem: CertificationItemResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CertificationItemUpdateComponent,
    resolve: {
      certificationItem: CertificationItemResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const certificationItemPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CertificationItemDeletePopupComponent,
    resolve: {
      certificationItem: CertificationItemResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationItem.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
