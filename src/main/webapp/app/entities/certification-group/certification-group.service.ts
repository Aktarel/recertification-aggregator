import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICertificationGroup } from 'app/shared/model/certification-group.model';

type EntityResponseType = HttpResponse<ICertificationGroup>;
type EntityArrayResponseType = HttpResponse<ICertificationGroup[]>;

@Injectable({ providedIn: 'root' })
export class CertificationGroupService {
  public resourceUrl = SERVER_API_URL + 'api/certification-groups';

  constructor(protected http: HttpClient) {}

  create(certificationGroup: ICertificationGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationGroup);
    return this.http
      .post<ICertificationGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(certificationGroup: ICertificationGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationGroup);
    return this.http
      .put<ICertificationGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICertificationGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICertificationGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(certificationGroup: ICertificationGroup): ICertificationGroup {
    const copy: ICertificationGroup = Object.assign({}, certificationGroup, {
      create: certificationGroup.create != null && certificationGroup.create.isValid() ? certificationGroup.create.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.create = res.body.create != null ? moment(res.body.create) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((certificationGroup: ICertificationGroup) => {
        certificationGroup.create = certificationGroup.create != null ? moment(certificationGroup.create) : null;
      });
    }
    return res;
  }
}
