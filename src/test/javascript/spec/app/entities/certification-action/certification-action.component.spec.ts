/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationActionComponent } from 'app/entities/certification-action/certification-action.component';
import { CertificationActionService } from 'app/entities/certification-action/certification-action.service';
import { CertificationAction } from 'app/shared/model/certification-action.model';

describe('Component Tests', () => {
  describe('CertificationAction Management Component', () => {
    let comp: CertificationActionComponent;
    let fixture: ComponentFixture<CertificationActionComponent>;
    let service: CertificationActionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationActionComponent],
        providers: []
      })
        .overrideTemplate(CertificationActionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CertificationActionComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationActionService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CertificationAction(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.certificationActions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
