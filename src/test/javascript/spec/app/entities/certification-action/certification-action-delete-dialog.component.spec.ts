/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationActionDeleteDialogComponent } from 'app/entities/certification-action/certification-action-delete-dialog.component';
import { CertificationActionService } from 'app/entities/certification-action/certification-action.service';

describe('Component Tests', () => {
  describe('CertificationAction Management Delete Component', () => {
    let comp: CertificationActionDeleteDialogComponent;
    let fixture: ComponentFixture<CertificationActionDeleteDialogComponent>;
    let service: CertificationActionService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationActionDeleteDialogComponent]
      })
        .overrideTemplate(CertificationActionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationActionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationActionService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
