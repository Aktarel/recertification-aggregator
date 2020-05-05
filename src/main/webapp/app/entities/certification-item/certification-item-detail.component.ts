import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificationItem } from 'app/shared/model/certification-item.model';

@Component({
  selector: 'jhi-certification-item-detail',
  templateUrl: './certification-item-detail.component.html'
})
export class CertificationItemDetailComponent implements OnInit {
  certificationItem: ICertificationItem;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ certificationItem }) => {
      this.certificationItem = certificationItem;
    });
  }

  previousState() {
    window.history.back();
  }
}
