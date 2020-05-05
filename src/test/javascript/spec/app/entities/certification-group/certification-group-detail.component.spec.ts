/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationGroupDetailComponent } from 'app/entities/certification-group/certification-group-detail.component';
import { CertificationGroup } from 'app/shared/model/certification-group.model';

describe('Component Tests', () => {
  describe('CertificationGroup Management Detail Component', () => {
    let comp: CertificationGroupDetailComponent;
    let fixture: ComponentFixture<CertificationGroupDetailComponent>;
    const route = ({ data: of({ certificationGroup: new CertificationGroup(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationGroupDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CertificationGroupDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationGroupDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.certificationGroup).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
