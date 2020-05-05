/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationItemUpdateComponent } from 'app/entities/certification-item/certification-item-update.component';
import { CertificationItemService } from 'app/entities/certification-item/certification-item.service';
import { CertificationItem } from 'app/shared/model/certification-item.model';

describe('Component Tests', () => {
  describe('CertificationItem Management Update Component', () => {
    let comp: CertificationItemUpdateComponent;
    let fixture: ComponentFixture<CertificationItemUpdateComponent>;
    let service: CertificationItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationItemUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CertificationItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CertificationItemUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationItemService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CertificationItem(123);
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
        const entity = new CertificationItem();
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
