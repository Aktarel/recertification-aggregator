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
  totalIdentityReviewed?: number;
  totalIdentities?: number;
}

export interface OptionGroup {
  id?: number;
  name?: string;
  type?: string;
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

export class Statistic implements Statistics {
  constructor(
    public revoked?: number,
    public approved?: number,
    public empty?: number,
    public totalCount?: number,
    public totalIdentities?: number,
    public totalIdentityReviewed?: number
  ) {}
}

export class OptionGroup implements OptionGroup {
  constructor(public id?: number, public name?: string, public type?: string) {}
}
