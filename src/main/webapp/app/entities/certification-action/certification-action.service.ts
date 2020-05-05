import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICertificationAction } from 'app/shared/model/certification-action.model';

type EntityResponseType = HttpResponse<ICertificationAction>;
type EntityArrayResponseType = HttpResponse<ICertificationAction[]>;

@Injectable({ providedIn: 'root' })
export class CertificationActionService {
  public resourceUrl = SERVER_API_URL + 'api/certification-actions';

  constructor(protected http: HttpClient) {}

  create(certificationAction: ICertificationAction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationAction);
    return this.http
      .post<ICertificationAction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(certificationAction: ICertificationAction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationAction);
    return this.http
      .put<ICertificationAction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICertificationAction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICertificationAction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(certificationAction: ICertificationAction): ICertificationAction {
    const copy: ICertificationAction = Object.assign({}, certificationAction, {
      completed:
        certificationAction.completed != null && certificationAction.completed.isValid() ? certificationAction.completed.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.completed = res.body.completed != null ? moment(res.body.completed) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((certificationAction: ICertificationAction) => {
        certificationAction.completed = certificationAction.completed != null ? moment(certificationAction.completed) : null;
      });
    }
    return res;
  }
}
