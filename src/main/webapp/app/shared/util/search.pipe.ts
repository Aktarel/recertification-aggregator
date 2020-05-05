import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], fields: string[], value: string, statusFilter: string[]): any[] {
    var ret = [];
    if (!items) {
      return [];
    }
    if (!fields || !value) {
      return items;
    }
    items.forEach(item => {
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (item['certDecision'] != null) {
          console.log(item['certDecision'].toLowerCase());
        }
        if (
          item[field].toLowerCase().includes(value.toLowerCase()) &&
          (statusFilter.indexOf(item['certDecision']) > -1 || statusFilter.length == 0)
        ) {
          ret.push(item);
          break;
        }
      }
    });
    console.log(ret);
    return ret;
  }
}
