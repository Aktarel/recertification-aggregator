import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICertificationItem, Statistic, OptionGroup } from 'app/shared/model/certification-item.model';

type EntityResponseType = HttpResponse<ICertificationItem>;
type EntityArrayResponseType = HttpResponse<ICertificationItem[]>;
type StatisticResponseType = HttpResponse<Statistic>;
type OptionGroupResponseType = HttpResponse<OptionGroup[]>;

@Injectable({ providedIn: 'root' })
export class CertificationItemService {
  public resourceUrl = SERVER_API_URL + 'api/certification-items';

  constructor(protected http: HttpClient) {}

  create(certificationItem: ICertificationItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationItem);
    return this.http
      .post<ICertificationItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(certificationItem: ICertificationItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificationItem);
    return this.http
      .put<ICertificationItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICertificationItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any, certGroupId: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICertificationItem[]>(this.resourceUrl + '/' + certGroupId, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStats(): Observable<StatisticResponseType> {
    return this.http
      .get<Statistic>(`${SERVER_API_URL + 'api/certification-items/statistics'}`, { observe: 'response' })
      .pipe(map((res: StatisticResponseType) => res));
  }
  getOptionGroups(): Observable<OptionGroupResponseType> {
    return this.http
      .get<OptionGroup[]>(`${SERVER_API_URL + 'api/certification-items/entities'}`, { observe: 'response' })
      .pipe(map((res: OptionGroupResponseType) => res));
  }

  protected convertDateFromClient(certificationItem: ICertificationItem): ICertificationItem {
    const copy: ICertificationItem = Object.assign({}, certificationItem, {
      created: certificationItem.created != null && certificationItem.created.isValid() ? certificationItem.created.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created != null ? moment(res.body.created) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((certificationItem: ICertificationItem) => {
        certificationItem.created = certificationItem.created != null ? moment(certificationItem.created) : null;
      });
    }
    return res;
  }
}
