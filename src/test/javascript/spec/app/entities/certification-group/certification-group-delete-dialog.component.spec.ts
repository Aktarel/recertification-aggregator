/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { RecertificationAggregatorTestModule } from '../../../test.module';
import { CertificationGroupDeleteDialogComponent } from 'app/entities/certification-group/certification-group-delete-dialog.component';
import { CertificationGroupService } from 'app/entities/certification-group/certification-group.service';

describe('Component Tests', () => {
  describe('CertificationGroup Management Delete Component', () => {
    let comp: CertificationGroupDeleteDialogComponent;
    let fixture: ComponentFixture<CertificationGroupDeleteDialogComponent>;
    let service: CertificationGroupService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RecertificationAggregatorTestModule],
        declarations: [CertificationGroupDeleteDialogComponent]
      })
        .overrideTemplate(CertificationGroupDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificationGroupDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CertificationGroupService);
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
