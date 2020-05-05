import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ICertificationItem, CertificationItem } from 'app/shared/model/certification-item.model';
import { CertificationItemService } from './certification-item.service';
import { ICertificationGroup } from 'app/shared/model/certification-group.model';
import { CertificationGroupService } from 'app/entities/certification-group';

@Component({
  selector: 'jhi-certification-item-update',
  templateUrl: './certification-item-update.component.html'
})
export class CertificationItemUpdateComponent implements OnInit {
  isSaving: boolean;

  certificationgroups: ICertificationGroup[];

  editForm = this.fb.group({
    id: [],
    targetAsset: [],
    targetIdentity: [],
    created: [],
    accountName: [],
    status: [],
    certItem: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected certificationItemService: CertificationItemService,
    protected certificationGroupService: CertificationGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ certificationItem }) => {
      this.updateForm(certificationItem);
    });
    this.certificationGroupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICertificationGroup[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICertificationGroup[]>) => response.body)
      )
      .subscribe((res: ICertificationGroup[]) => (this.certificationgroups = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(certificationItem: ICertificationItem) {
    this.editForm.patchValue({
      id: certificationItem.id,
      targetAsset: certificationItem.targetAsset,
      targetIdentity: certificationItem.targetIdentity,
      created: certificationItem.created != null ? certificationItem.created.format(DATE_TIME_FORMAT) : null,
      accountName: certificationItem.accountName,
      status: certificationItem.status
      //certItem: certificationItem.certItem
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const certificationItem = this.createFromForm();
    if (certificationItem.id !== undefined) {
      this.subscribeToSaveResponse(this.certificationItemService.update(certificationItem));
    } else {
      this.subscribeToSaveResponse(this.certificationItemService.create(certificationItem));
    }
  }

  private createFromForm(): ICertificationItem {
    return {
      ...new CertificationItem(),
      id: this.editForm.get(['id']).value,
      targetAsset: this.editForm.get(['targetAsset']).value,
      targetIdentity: this.editForm.get(['targetIdentity']).value,
      created: this.editForm.get(['created']).value != null ? moment(this.editForm.get(['created']).value, DATE_TIME_FORMAT) : undefined,
      accountName: this.editForm.get(['accountName']).value,
      status: this.editForm.get(['status']).value
      //certItem: this.editForm.get(['certItem']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificationItem>>) {
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

  trackCertificationGroupById(index: number, item: ICertificationGroup) {
    return item.id;
  }
}
