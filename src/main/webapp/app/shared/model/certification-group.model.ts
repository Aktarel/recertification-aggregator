import { Moment } from 'moment';

export interface ICertificationGroup {
  id?: number;
  systemName?: string;
  accessReviewName?: string;
  create?: Moment;
  ownerName?: string;
  status?: string;
}

export class CertificationGroup implements ICertificationGroup {
  constructor(
    public id?: number,
    public systemName?: string,
    public accessReviewName?: string,
    public create?: Moment,
    public ownerName?: string,
    public status?: string
  ) {}
}
