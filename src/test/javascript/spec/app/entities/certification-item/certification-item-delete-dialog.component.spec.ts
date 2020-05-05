/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationItemDeleteDialogComponent } from 'app/entities/certification-item/certification-item-delete-dialog.component';
import { CertificationItemService } from 'app/entities/certification-item/certification-item.service';

describe('Component Tests', () => {
  describe('CertificationItem Management Delete Component', () => {
    let comp: CertificationItemDeleteDialogComponent;
    let fixture: ComponentFixture<CertificationItemDeleteDialogComponent>;
    let service: CertificationItemService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationItemDeleteDialogComponent]
      })
        .overrideTemplate(CertificationItemDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationItemDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationItemService);
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
