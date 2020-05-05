import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ICertificationGroup, CertificationGroup } from 'app/shared/model/certification-group.model';
import { CertificationGroupService } from './certification-group.service';

@Component({
  selector: 'jhi-certification-group-update',
  templateUrl: './certification-group-update.component.html'
})
export class CertificationGroupUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    systemName: [],
    accessReviewName: [],
    create: [],
    ownerName: [],
    status: []
  });

  constructor(
    protected certificationGroupService: CertificationGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ certificationGroup }) => {
      this.updateForm(certificationGroup);
    });
  }

  updateForm(certificationGroup: ICertificationGroup) {
    this.editForm.patchValue({
      id: certificationGroup.id,
      systemName: certificationGroup.systemName,
      accessReviewName: certificationGroup.accessReviewName,
      create: certificationGroup.create != null ? certificationGroup.create.format(DATE_TIME_FORMAT) : null,
      ownerName: certificationGroup.ownerName,
      status: certificationGroup.status
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const certificationGroup = this.createFromForm();
    if (certificationGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.certificationGroupService.update(certificationGroup));
    } else {
      this.subscribeToSaveResponse(this.certificationGroupService.create(certificationGroup));
    }
  }

  private createFromForm(): ICertificationGroup {
    return {
      ...new CertificationGroup(),
      id: this.editForm.get(['id']).value,
      systemName: this.editForm.get(['systemName']).value,
      accessReviewName: this.editForm.get(['accessReviewName']).value,
      create: this.editForm.get(['create']).value != null ? moment(this.editForm.get(['create']).value, DATE_TIME_FORMAT) : undefined,
      ownerName: this.editForm.get(['ownerName']).value,
      status: this.editForm.get(['status']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificationGroup>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
