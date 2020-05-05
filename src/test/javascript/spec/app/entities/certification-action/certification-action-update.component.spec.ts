/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationActionUpdateComponent } from 'app/entities/certification-action/certification-action-update.component';
import { CertificationActionService } from 'app/entities/certification-action/certification-action.service';
import { CertificationAction } from 'app/shared/model/certification-action.model';

describe('Component Tests', () => {
  describe('CertificationAction Management Update Component', () => {
    let comp: CertificationActionUpdateComponent;
    let fixture: ComponentFixture<CertificationActionUpdateComponent>;
    let service: CertificationActionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationActionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CertificationActionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CertificationActionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationActionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CertificationAction(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new CertificationAction();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
