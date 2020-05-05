import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ICertificationAction, CertificationAction } from 'app/shared/model/certification-action.model';
import { CertificationActionService } from './certification-action.service';
import { ICertificationItem } from 'app/shared/model/certification-item.model';
import { CertificationItemService } from 'app/entities/certification-item';

@Component({
  selector: 'jhi-certification-action-update',
  templateUrl: './certification-action-update.component.html'
})
export class CertificationActionUpdateComponent implements OnInit {
  isSaving: boolean;

  certificationitems: ICertificationItem[];

  editForm = this.fb.group({
    id: [],
    completed: [],
    decision: [],
    action: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected certificationActionService: CertificationActionService,
    protected certificationItemService: CertificationItemService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ certificationAction }) => {
      this.updateForm(certificationAction);
    });
    this.certificationItemService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICertificationItem[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICertificationItem[]>) => response.body)
      )
      .subscribe((res: ICertificationItem[]) => (this.certificationitems = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(certificationAction: ICertificationAction) {
    this.editForm.patchValue({
      id: certificationAction.id,
      completed: certificationAction.completed != null ? certificationAction.completed.format(DATE_TIME_FORMAT) : null,
      decision: certificationAction.decision,
      action: certificationAction.action
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const certificationAction = this.createFromForm();
    if (certificationAction.id !== undefined) {
      this.subscribeToSaveResponse(this.certificationActionService.update(certificationAction));
    } else {
      this.subscribeToSaveResponse(this.certificationActionService.create(certificationAction));
    }
  }

  private createFromForm(): ICertificationAction {
    return {
      ...new CertificationAction(),
      id: this.editForm.get(['id']).value,
      completed:
        this.editForm.get(['completed']).value != null ? moment(this.editForm.get(['completed']).value, DATE_TIME_FORMAT) : undefined,
      decision: this.editForm.get(['decision']).value,
      action: this.editForm.get(['action']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificationAction>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCertificationItemById(index: number, item: ICertificationItem) {
    return item.id;
  }
}
