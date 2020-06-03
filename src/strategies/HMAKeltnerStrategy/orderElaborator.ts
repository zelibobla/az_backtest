import { Md5 } from 'ts-md5/dist/md5';
import BarInterface from '../../typings/bar.interface';
import { InstrumentInterface } from '../../typings/instument.interface';
import {
  OrderInterface,
  OrderDirectionEnum,
  OrderTypeEnum,
} from '../../typings/order.interface';

const decideBuy = (
  bar: BarInterface,
  instrument: InstrumentInterface,
  options: any,
  lastOrder: OrderInterface,
): OrderInterface => {
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
    const order = {
      direction: OrderDirectionEnum.BUY,
      type: OrderTypeEnum.MKT,
      stopLoss,
      takeProfit,
    } as OrderInterface;
    order.hash = Md5.hashStr(
      JSON.stringify(bar) + JSON.stringify(order),
    ) as string;
    return order;
  }
  return null;
};

const decideSell = (
  bar: BarInterface,
  instrument: InstrumentInterface,
  options: any,
  lastOrder: OrderInterface,
): OrderInterface => {
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
    const order = {
      direction: OrderDirectionEnum.SELL,
      type: OrderTypeEnum.MKT,
      stopLoss,
      takeProfit,
    } as OrderInterface;
    order.hash = Md5.hashStr(
      JSON.stringify(bar) + JSON.stringify(order),
    ) as string;
    return order;
  }
  return null;
};

const elaborateOrder = (bar, instrument, options, lastOrder) => {
  return (
    decideSell(bar, instrument, options, lastOrder) ||
    decideBuy(bar, instrument, options, lastOrder)
  );
};

export { elaborateOrder };
