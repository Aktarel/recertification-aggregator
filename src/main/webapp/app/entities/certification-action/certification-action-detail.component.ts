import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificationAction } from 'app/shared/model/certification-action.model';

@Component({
  selector: 'jhi-certification-action-detail',
  templateUrl: './certification-action-detail.component.html'
})
export class CertificationActionDetailComponent implements OnInit {
  certificationAction: ICertificationAction;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationAction }) => {
      this.certificationAction = certificationAction;
    });
  }

  previousState() {
    window.history.back();
  }
}
