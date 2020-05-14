import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], fields: string[], values: string[], statusFilter: string[]): any[] {
    var ret = [];
    if (!items) {
      return [];
    }
    if (!fields || (!Array.isArray(values) || values.length == 0)) {
      return items;
    }
    //to lowercase filter predicates
    for (var i = 0; i < values.length; i++) {
      values[i] = values[i].toString().toLowerCase();
    }
    items.forEach(item => {
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        //
        if (item['certDecision'] != null) {
          console.log(item['certDecision'].toLowerCase());
        }
        if (
          (item[field] !== null && values.includes(item[field].toLowerCase())) ||
          (item['certDecision'] == null && values.includes('unresolved'))
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
