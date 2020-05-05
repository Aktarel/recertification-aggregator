import { Moment } from 'moment';
import { ICertificationItem } from 'app/shared/model/certification-item.model';

export interface ICertificationAction {
  id?: number;
  completed?: Moment;
  decision?: string;
  action?: ICertificationItem;
}

export class CertificationAction implements ICertificationAction {
  constructor(public id?: number, public completed?: Moment, public decision?: string, public action?: ICertificationItem) {}
}
