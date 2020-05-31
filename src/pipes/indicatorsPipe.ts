import { from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import BarInterface from '../typings/bar.interface';
import { IndicatorSettingsInterface } from '../typings/indicator.interface';

const tail: BarInterface[] = [];

const indicatorsPipe = (indicators: IndicatorSettingsInterface[]) =>
  concatMap(
    (bar: BarInterface): Observable<BarInterface> => {
      const longestPeriod = indicators
        .map(i => i.options.period)
        .sort()
        .pop();
      if (tail.length > longestPeriod * 2) {
        tail.shift();
      }
      if (!bar.indicators) {
        bar.indicators = new Map();
      }
      tail.push(bar);
      return from(
        Promise.all(
          indicators.map((settings: IndicatorSettingsInterface) => {
            return settings.indicator
              .calc(tail, settings.options.period)
              .then(results => {
                bar.indicators.set(settings.options.key, results.pop());
                return bar;
              });
          }),
        ).then(() => {
          return bar;
        }),
      );
    },
  );

export { indicatorsPipe };
