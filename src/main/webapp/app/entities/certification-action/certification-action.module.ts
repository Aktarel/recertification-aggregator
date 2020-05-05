import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { RecertificationAggregatorSharedModule } from 'app/shared';
import {
  CertificationActionComponent,
  CertificationActionDetailComponent,
  CertificationActionUpdateComponent,
  CertificationActionDeletePopupComponent,
  CertificationActionDeleteDialogComponent,
  certificationActionRoute,
  certificationActionPopupRoute
} from './';

const ENTITY_STATES = [...certificationActionRoute, ...certificationActionPopupRoute];

@NgModule({
  imports: [RecertificationAggregatorSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CertificationActionComponent,
    CertificationActionDetailComponent,
    CertificationActionUpdateComponent,
    CertificationActionDeleteDialogComponent,
    CertificationActionDeletePopupComponent
  ],
  entryComponents: [
    CertificationActionComponent,
    CertificationActionUpdateComponent,
    CertificationActionDeleteDialogComponent,
    CertificationActionDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecertificationAggregatorCertificationActionModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
