import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecertificationAggregatorSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
@NgModule({
  imports: [RecertificationAggregatorSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [RecertificationAggregatorSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecertificationAggregatorSharedModule {
  static forRoot() {
    return {
      ngModule: RecertificationAggregatorSharedModule
    };
  }
}
