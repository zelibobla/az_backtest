import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import BarInterface from '../typings/bar.interface';
import { InstrumentInterface } from '../typings/instument.interface';
import { StrategyInterface } from '../typings/strategy.interface';

const store = {};

const strategyPipe = (
  instrument: InstrumentInterface,
  strategy: StrategyInterface,
) =>
  concatMap((bar: BarInterface) => {
    const state = store[strategy.key] || strategy.defaultState;
    return from(
      strategy
        .digest(instrument, strategy.defaults, state, bar)
        .then(strategyOutput => {
          store[strategy.key] = strategyOutput.state;
          return { bar, decisions: strategyOutput.decisions };
        }),
    );
  });

export { strategyPipe };
