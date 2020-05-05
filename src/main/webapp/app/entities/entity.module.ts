import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'certification-group',
        loadChildren: './certification-group/certification-group.module#RecertificationAggregatorCertificationGroupModule'
      },
      {
        path: 'certification-item',
        loadChildren: './certification-item/certification-item.module#RecertificationAggregatorCertificationItemModule'
      }
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecertificationAggregatorEntityModule {}
