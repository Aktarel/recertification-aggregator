import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { RecertificationAggregatorSharedModule } from 'app/shared';
import {
  CertificationGroupComponent,
  CertificationGroupDetailComponent,
  CertificationGroupUpdateComponent,
  CertificationGroupDeletePopupComponent,
  CertificationGroupDeleteDialogComponent,
  certificationGroupRoute,
  certificationGroupPopupRoute
} from './';

const ENTITY_STATES = [...certificationGroupRoute, ...certificationGroupPopupRoute];

@NgModule({
  imports: [RecertificationAggregatorSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CertificationGroupComponent,
    CertificationGroupDetailComponent,
    CertificationGroupUpdateComponent,
    CertificationGroupDeleteDialogComponent,
    CertificationGroupDeletePopupComponent
  ],
  entryComponents: [
    CertificationGroupComponent,
    CertificationGroupUpdateComponent,
    CertificationGroupDeleteDialogComponent,
    CertificationGroupDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecertificationAggregatorCertificationGroupModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
