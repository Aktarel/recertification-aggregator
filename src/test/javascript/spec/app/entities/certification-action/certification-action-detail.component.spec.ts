/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationActionDetailComponent } from 'app/entities/certification-action/certification-action-detail.component';
import { CertificationAction } from 'app/shared/model/certification-action.model';

describe('Component Tests', () => {
  describe('CertificationAction Management Detail Component', () => {
    let comp: CertificationActionDetailComponent;
    let fixture: ComponentFixture<CertificationActionDetailComponent>;
    const route = ({ data: of({ certificationAction: new CertificationAction(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationActionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CertificationActionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationActionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.certificationAction).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
