/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationGroupUpdateComponent } from 'app/entities/certification-group/certification-group-update.component';
import { CertificationGroupService } from 'app/entities/certification-group/certification-group.service';
import { CertificationGroup } from 'app/shared/model/certification-group.model';

describe('Component Tests', () => {
  describe('CertificationGroup Management Update Component', () => {
    let comp: CertificationGroupUpdateComponent;
    let fixture: ComponentFixture<CertificationGroupUpdateComponent>;
    let service: CertificationGroupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationGroupUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CertificationGroupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CertificationGroupUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationGroupService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CertificationGroup(123);
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
        const entity = new CertificationGroup();
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
