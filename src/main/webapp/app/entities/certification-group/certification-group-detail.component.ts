import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificationGroup } from 'app/shared/model/certification-group.model';

@Component({
  selector: 'jhi-certification-group-detail',
  templateUrl: './certification-group-detail.component.html'
})
export class CertificationGroupDetailComponent implements OnInit {
  certificationGroup: ICertificationGroup;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationGroup }) => {
      this.certificationGroup = certificationGroup;
    });
  }

  previousState() {
    window.history.back();
  }
}
