import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-signing-modal',
  templateUrl: './signing-modal.component.html'
})
export class SigningModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
