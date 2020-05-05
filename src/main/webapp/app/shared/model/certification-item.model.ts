import { Moment } from 'moment';
import { ICertificationGroup } from 'app/shared/model/certification-group.model';

export interface ICertificationItem {
  id?: number;
  targetApplicationName?: string;
  targetAsset?: string;
  targetIdentity?: string;
  created?: Moment;
  accountName?: string;
  status?: string;
  certGroup?: ICertificationGroup;
  certDecision?: string;
}

export interface Statistics {
  revoked?: number;
  approved?: number;
  empty?: number;
  totalCount?: number;
}

export class CertificationItem implements ICertificationItem {
  constructor(
    public id?: number,
    public targetApplicationName?: string,
    public targetAsset?: string,
    public targetIdentity?: string,
    public created?: Moment,
    public accountName?: string,
    public status?: string,
    public certDecision?: string,
    public certGroup?: ICertificationGroup
  ) {}
}

export class Statistic {
  constructor(public revoked?: number, public approved?: number, public empty?: number, public totalCount?: number) {}
}
