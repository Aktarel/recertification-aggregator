import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'countPercentage'
})
@Injectable()
export class CountPercentagePipe implements PipeTransform {
  transform(value: number, previous: number): string {
    return ((value / previous) * 100).toFixed(1);
  }
}
