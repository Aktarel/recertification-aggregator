import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CertificationAction } from 'app/shared/model/certification-action.model';
import { CertificationActionService } from './certification-action.service';
import { CertificationActionComponent } from './certification-action.component';
import { CertificationActionDetailComponent } from './certification-action-detail.component';
import { CertificationActionUpdateComponent } from './certification-action-update.component';
import { CertificationActionDeletePopupComponent } from './certification-action-delete-dialog.component';
import { ICertificationAction } from 'app/shared/model/certification-action.model';

@Injectable({ providedIn: 'root' })
export class CertificationActionResolve implements Resolve<ICertificationAction> {
  constructor(private service: CertificationActionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICertificationAction> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CertificationAction>) => response.ok),
        map((certificationAction: HttpResponse<CertificationAction>) => certificationAction.body)
      );
    }
    return of(new CertificationAction());
  }
}

export const certificationActionRoute: Routes = [
  {
    path: '',
    component: CertificationActionComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationAction.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CertificationActionDetailComponent,
    resolve: {
      certificationAction: CertificationActionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationAction.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CertificationActionUpdateComponent,
    resolve: {
      certificationAction: CertificationActionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationAction.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CertificationActionUpdateComponent,
    resolve: {
      certificationAction: CertificationActionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationAction.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const certificationActionPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CertificationActionDeletePopupComponent,
    resolve: {
      certificationAction: CertificationActionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationAction.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
