import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import BarInterface from '../typings/bar.interface';
import {
  IndicatorInterface,
  IndicatorParamsInterface,
} from '../typings/indicator.interface';

const tail: BarInterface[] = [];

const indicatorPipe = (
  indicator: IndicatorInterface,
  indicatorParams: IndicatorParamsInterface,
) =>
  concatMap((bar: BarInterface) => {
    if (tail.length > indicatorParams.period * 2) {
      tail.shift();
    }
    if (!bar.indicators) {
      bar.indicators = new Map();
    }
    tail.push(bar);
    return from(
      indicator.calc(tail, indicatorParams.period).then(results => {
        bar.indicators.set(indicatorParams.key, results.pop());
        return bar;
      }),
    );
  });

export { indicatorPipe };
