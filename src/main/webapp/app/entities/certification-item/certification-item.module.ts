import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { RecertificationAggregatorSharedModule } from 'app/shared';
import {
  CertificationItemComponent,
  CertificationItemDetailComponent,
  CertificationItemUpdateComponent,
  CertificationItemDeletePopupComponent,
  CertificationItemDeleteDialogComponent,
  certificationItemRoute,
  certificationItemPopupRoute,
  FilterPipe,
  CountPercentagePipe
} from './';

const ENTITY_STATES = [...certificationItemRoute, ...certificationItemPopupRoute];

@NgModule({
  imports: [RecertificationAggregatorSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CertificationItemComponent,
    CertificationItemDetailComponent,
    CertificationItemUpdateComponent,
    CertificationItemDeleteDialogComponent,
    CertificationItemDeletePopupComponent,
    FilterPipe,
    CountPercentagePipe
  ],
  entryComponents: [
    CertificationItemComponent,
    CertificationItemUpdateComponent,
    CertificationItemDeleteDialogComponent,
    CertificationItemDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [FilterPipe, CountPercentagePipe]
})
export class RecertificationAggregatorCertificationItemModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
