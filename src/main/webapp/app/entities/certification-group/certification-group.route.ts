import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CertificationGroup } from 'app/shared/model/certification-group.model';
import { CertificationGroupService } from './certification-group.service';
import { CertificationGroupComponent } from './certification-group.component';
import { CertificationGroupDetailComponent } from './certification-group-detail.component';
import { CertificationGroupUpdateComponent } from './certification-group-update.component';
import { CertificationGroupDeletePopupComponent } from './certification-group-delete-dialog.component';
import { ICertificationGroup } from 'app/shared/model/certification-group.model';

@Injectable({ providedIn: 'root' })
export class CertificationGroupResolve implements Resolve<ICertificationGroup> {
  constructor(private service: CertificationGroupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICertificationGroup> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CertificationGroup>) => response.ok),
        map((certificationGroup: HttpResponse<CertificationGroup>) => certificationGroup.body)
      );
    }
    return of(new CertificationGroup());
  }
}

export const certificationGroupRoute: Routes = [
  {
    path: '',
    component: CertificationGroupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CertificationGroupDetailComponent,
    resolve: {
      certificationGroup: CertificationGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CertificationGroupUpdateComponent,
    resolve: {
      certificationGroup: CertificationGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CertificationGroupUpdateComponent,
    resolve: {
      certificationGroup: CertificationGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const certificationGroupPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CertificationGroupDeletePopupComponent,
    resolve: {
      certificationGroup: CertificationGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'recertificationAggregatorApp.certificationGroup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
