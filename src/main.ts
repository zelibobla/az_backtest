import { program } from 'commander';
import { merge } from 'rxjs';
import { share } from 'rxjs/operators';

import { ATR } from './indicators/atrIndicator';
import { backtestBroker } from './brokers/backtestBroker';
import { brokerPipe } from './pipes/brokerPipe';
import { errors, hints } from './constants/messages';
import { HMA } from './indicators/hmaIndicator';
import { HMAKeltnerStrategy } from './strategies/HMAKeltnerStrategy/HMAKeltnerStrategy';
import { indicatorsPipe } from './pipes/indicatorsPipe';
import { InstrumentInterface } from './typings/instument.interface';
import { /* parseTickLine ,*/ parseBarLine } from './parsers/csvParser';
import { store } from './services/storeService';
import { streamBarsFromFile } from './services/barEmitterService';
import { strategyPipe } from './pipes/strategyPipe';

program
  .option('-i, --history <path>', hints.HISTORY)
  .option('-s, --strategy <path>', hints.STRATEGY);
program.parse(process.argv);

if (!program.history) {
  console.log(errors.HISTORY_NOT_SPECIFIED);
  process.exit();
}

const { history } = program.opts();
const instrument = { symbol: 'US500', pip: 0.01 } as InstrumentInterface;
//const observable = streamDataFromFile(history, parseTickLine);

store.setStrategyState(HMAKeltnerStrategy.key, HMAKeltnerStrategy.defaultState);

const barsObservable = streamBarsFromFile(history, parseBarLine).pipe(share());
const dealsObservable = barsObservable.pipe(
  indicatorsPipe([
    { indicator: HMA, options: { key: 'HMA50', period: 50 } },
    { indicator: ATR, options: { key: 'ATR50', period: 50 } },
  ]),
  strategyPipe(store, instrument, HMAKeltnerStrategy),
  brokerPipe(store, backtestBroker),
);

const observable = merge(dealsObservable);

let barNum = 0;
observable.subscribe(
  obj => {
    barNum += 1;
    console.log(barNum, +obj);
  },
  undefined,
  () => {
    const summary = [];
    store.getStrategyState(HMAKeltnerStrategy.key).trades.forEach(trade => {
      console.log(trade);
      const profit =
        (trade.closeOrder.filledPrice - trade.openOrder.filledPrice) *
        (trade.openOrder.dir === 'SELL' ? -1 : 1);
      summary.push({
        start: trade.openOrder.bar.original_date,
        dir: trade.openOrder.direction,
        priceEnter: trade.openOrder.filledPrice,
        end: trade.closeOrder.bar.original_date,
        priceExit: trade.closeOrder.filledPrice,
        profit,
      });
    });
    console.log(summary);
    const total = summary.reduce((memo, s) => {
      memo += s.profit;
      return memo;
    }, 0);
    console.log(`>>>> ${summary.length} trades, ${total} in total <<<<`);
  },
);
