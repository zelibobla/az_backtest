import { from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import BarInterface from '../typings/bar.interface';
import { InstrumentInterface } from '../typings/instument.interface';
import { StoreInterface } from '../typings/store.interface';
import { StrategyInterface } from '../typings/strategy.interface';

const strategyPipe = (
  store: StoreInterface,
  instrument: InstrumentInterface,
  strategy: StrategyInterface,
) =>
  concatMap(
    (bar: BarInterface): Observable<BarInterface> => {
      const state = store.getStrategyState(strategy.key);
      return from(
        strategy
          .digest(state, instrument, bar, strategy.defaults)
          .then(state => {
            store.setStrategyState(strategy.key, state);
            return bar;
          }),
      );
    },
  );

export { strategyPipe };
