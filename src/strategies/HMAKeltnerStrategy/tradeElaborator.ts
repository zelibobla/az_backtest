import BarInterface from '../../typings/bar.interface';
import { InstrumentInterface } from '../../typings/instument.interface';
import {
  OrderDirectionEnum,
  OrderTypeEnum,
} from '../../typings/order.interface';
import { tradeFactory } from '../../factories/tradeFactory';
import { TradeInterface } from '../../typings/trade.interface';

const decideBuy = (
  bar: BarInterface,
  instrument: InstrumentInterface,
  options: any,
): TradeInterface => {
  const HMA50 = bar.indicators.get('HMA50');
  const ATR50 = bar.indicators.get('ATR50');
  const bottom = HMA50 - ATR50 * options.boundsWidthATR;
  if (
    (options.enterOnBorderTouchFromInside &&
      bar.open > bottom &&
      bar.low < bottom) ||
    (!options.enterOnBorderTouchFromInside &&
      bar.open < bottom &&
      bar.close > bottom)
  ) {
    const stopLoss = bar.close - ATR50 * options.stopLossATR;
    const takeProfit = bar.close + ATR50 * options.takeProfitATR;
    return tradeFactory.create(
      OrderDirectionEnum.BUY,
      OrderTypeEnum.MKT,
      instrument.symbol,
      1,
      bar.close,
      stopLoss,
      takeProfit,
    );
  }
  return null;
};

const decideSell = (
  bar: BarInterface,
  instrument: InstrumentInterface,
  options: any,
): TradeInterface => {
  const HMA50 = bar.indicators.get('HMA50');
  const ATR50 = bar.indicators.get('ATR50');
  const top = HMA50 + ATR50 * options.boundsWidthATR;
  if (
    (options.enterOnBorderTouchFromInside &&
      bar.open < top &&
      bar.high > top) ||
    (!options.enterOnBorderTouchFromInside && bar.open > top && bar.low < top)
  ) {
    const stopLoss = bar.close + ATR50 * options.stopLossATR;
    const takeProfit = bar.close - ATR50 * options.takeProfitATR;
    return tradeFactory.create(
      OrderDirectionEnum.SELL,
      OrderTypeEnum.MKT,
      instrument.symbol,
      1,
      bar.close,
      stopLoss,
      takeProfit,
    );
  }
  return null;
};

const elaborateTrade = (
  bar: BarInterface,
  instrument: InstrumentInterface,
  options: any,
) => {
  return (
    decideSell(bar, instrument, options) || decideBuy(bar, instrument, options)
  );
};

export { elaborateTrade };
