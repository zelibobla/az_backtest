import BarInterface from '../../typings/bar.interface';
import { InstrumentInterface } from '../../typings/instument.interface';
import {
  StrategyInterface,
  StrategyStateInterface,
} from '../../typings/strategy.interface';
import { elaborateOrder } from './orderElaborator';
import { defaults, messages } from './settings';

const HMAKeltnerStrategy = {
  key: 'hmaKeltner',
  defaults,
  defaultState: { orders: [] },
  digest: (
    state: StrategyStateInterface,
    instrument: InstrumentInterface,
    bar: BarInterface,
    options: any,
  ): Promise<StrategyStateInterface> =>
    new Promise(resolve => {
      if (
        !bar.indicators ||
        !bar.indicators.get(options.baselineIndicatorKey) ||
        !bar.indicators.get(options.boundsIndicatorKey)
      ) {
        console.warn(
          messages.LACK_OF_KEYS({
            baseline: options.baselineIndicatorKey,
            bounds: options.boundsIndicatorKey,
          }),
        );
        return resolve(state);
      }
      const [lastOrder] = state.orders.slice(-1);
      const order = elaborateOrder(bar, instrument, options, lastOrder);

      if (order) {
        state.orders.push(order);
      }
      resolve(state);
    }),
} as StrategyInterface;

export { HMAKeltnerStrategy };
