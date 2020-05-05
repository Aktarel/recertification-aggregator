/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationItemDetailComponent } from 'app/entities/certification-item/certification-item-detail.component';
import { CertificationItem } from 'app/shared/model/certification-item.model';

describe('Component Tests', () => {
  describe('CertificationItem Management Detail Component', () => {
    let comp: CertificationItemDetailComponent;
    let fixture: ComponentFixture<CertificationItemDetailComponent>;
    const route = ({ data: of({ certificationItem: new CertificationItem(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationItemDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CertificationItemDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationItemDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.certificationItem).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
