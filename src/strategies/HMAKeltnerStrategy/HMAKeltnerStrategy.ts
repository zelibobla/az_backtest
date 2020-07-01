import BarInterface from '../../typings/bar.interface';
import { InstrumentInterface } from '../../typings/instument.interface';
import {
  StrategyInterface,
  StrategyStateInterface,
} from '../../typings/strategy.interface';
import { elaborateTrade } from './tradeElaborator';
import { defaults, messages } from './settings';
import { TradeStatusEnum } from '../../typings/trade.interface';
import { OrderDirectionEnum } from '../../typings/order.interface';
import { markTradeCloseBySwing } from '../../services/tradeService';

const HMAKeltnerStrategy = {
  key: 'hmaKeltner',
  defaults,
  defaultState: { positions: new Map(), orders: new Map(), trades: [] },
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
      const trade = elaborateTrade(bar, instrument, options);
      const [lastTrade] = state.trades
        .filter(t =>
          [TradeStatusEnum.ACTIVE, TradeStatusEnum.CLOSED].includes(t.status),
        )
        .slice(-1);

      if (
        trade &&
        (lastTrade == undefined ||
          !options.swingTradesDirection ||
          (trade.openOrder.direction === OrderDirectionEnum.BUY &&
            options.swingTradesDirection &&
            lastTrade.openOrder.direction === OrderDirectionEnum.SELL) ||
          (trade.openOrder.direction === OrderDirectionEnum.SELL &&
            options.swingTradesDirection &&
            lastTrade.openOrder.direction === OrderDirectionEnum.BUY))
      ) {
        if (lastTrade) {
          markTradeCloseBySwing(state, lastTrade, trade.openOrder, bar);
        }
        state.orders.set(trade.openOrder.hash, trade.openOrder);
        state.trades.push(trade);
      }
      resolve(state);
    }),
} as StrategyInterface;

export { HMAKeltnerStrategy };
