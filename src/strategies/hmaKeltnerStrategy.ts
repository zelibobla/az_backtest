import BarInterface from '../typings/bar.interface';
import { InstrumentInterface } from '../typings/instument.interface';
import {
  OrderInterface,
  OrderDirectionEnum,
  OrderTypeEnum,
} from '../typings/order.interface';
import { DecisionInterface } from '../typings/decision.interface';
import {
  StrategyInterface,
  StrategyState,
  StrategyOutputInterface,
} from '../typings/strategy.interface';

const defaults = {
  baselineIndicatorKey: 'HMA50',
  boundsIndicatorKey: 'ATR50',
  boundsWidthATR: 2.1,
  enterOnBorderTouchFromInside: true,
  takeProfitATR: 4,
  stopLossATR: 4,
  swingTradesDirection: true,
};

const decideBuy = (
  lastOrder: OrderInterface,
  options: any,
  bar: BarInterface,
  instrument: InstrumentInterface,
): DecisionInterface => {
  const HMA50 = bar.indicators.get('HMA50');
  const ATR50 = bar.indicators.get('ATR50');
  const bottom = HMA50 - ATR50 * options.boundsWidthATR;
  if (
    (lastOrder == undefined ||
      !options.swingTradesDirection ||
      (options.swingTradesDirection &&
        lastOrder.direction === OrderDirectionEnum.SELL)) &&
    ((options.enterOnBorderTouchFromInside &&
      bar.open > bottom &&
      bar.low < bottom) ||
      (!options.enterOnBorderTouchFromInside &&
        bar.open < bottom &&
        bar.close > bottom))
  ) {
    const stopLoss = bar.close - (ATR50 * options.stopLossATR) / instrument.pip;
    const takeProfit =
      bar.close + (ATR50 * options.takeProfitATR) / instrument.pip;
    return {
      direction: OrderDirectionEnum.BUY,
      type: OrderTypeEnum.MKT,
      stopLoss,
      takeProfit,
    } as DecisionInterface;
  }
  return null;
};

const decideSell = (
  lastOrder: OrderInterface,
  options: any,
  bar: BarInterface,
  instrument: InstrumentInterface,
): DecisionInterface => {
  const HMA50 = bar.indicators.get('HMA50');
  const ATR50 = bar.indicators.get('ATR50');
  const top = HMA50 + ATR50 * options.boundsWidthATR;
  if (
    (lastOrder == undefined ||
      !options.swingTradesDirection ||
      (options.swingTradesDirection &&
        lastOrder.direction === OrderDirectionEnum.BUY)) &&
    ((options.enterOnBorderTouchFromInside &&
      bar.open < top &&
      bar.high > top) ||
      (!options.enterOnBorderTouchFromInside &&
        bar.open > top &&
        bar.low < top))
  ) {
    const stopLoss = bar.close + (ATR50 * options.stopLossATR) / instrument.pip;
    const takeProfit =
      bar.close - (ATR50 * options.takeProfitATR) / instrument.pip;
    return {
      direction: OrderDirectionEnum.SELL,
      type: OrderTypeEnum.MKT,
      stopLoss,
      takeProfit,
    } as DecisionInterface;
  }
  return null;
};

const HMAKeltnerStrategy = {
  key: 'hmaKeltner',
  defaults,
  defaultState: { orders: [] },
  digest: (
    instrument: InstrumentInterface,
    options: any,
    state: StrategyState,
    bar: BarInterface,
  ): Promise<StrategyOutputInterface> =>
    new Promise(resolve => {
      const decisions = [];
      if (
        !bar.indicators ||
        !bar.indicators.get(options.baselineIndicatorKey) ||
        !bar.indicators.get(options.boundsIndicatorKey)
      ) {
        console.warn(
          `HMA Keltner Strategy: can't make decision in absense of ` +
            `'${options.baselineIndicatorKey}' and '${options.boundsIndicatorKey}' indicators`,
        );
        return resolve({ state, decisions } as StrategyOutputInterface);
      }

      const [lastOrder] = state.orders.slice(-1);
      const decision =
        decideSell(lastOrder, options, bar, instrument) ||
        decideBuy(lastOrder, options, bar, instrument);

      if (decision) {
        decisions.push(decision);
        state.orders.push(decision);
      }
      resolve({ state, decisions } as StrategyOutputInterface);
    }),
} as StrategyInterface;

export { HMAKeltnerStrategy };
