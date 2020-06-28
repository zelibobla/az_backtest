import { renderString } from '../../services/commonService';

const defaults = {
  baselineIndicatorKey: 'HMA50',
  boundsIndicatorKey: 'ATR50',
  boundsWidthATR: 2.1,
  enterOnBorderTouchFromInside: true,
  takeProfitATR: 4,
  stopLossATR: 4,
  swingTradesDirection: true,
  newTradeOverrideCurrent: true,
};

const messages = {
  LACK_OF_KEYS: renderString`HMA Keltner Strategy: can't make decision in absense of ${'baseline'} and ${'bounds'} indicators`,
};

export { defaults, messages };
