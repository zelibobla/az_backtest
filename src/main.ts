import { program } from 'commander';

import { ATR } from './indicators/atrIndicator';
import { backtestBroker } from './brokers/backtestBroker';
import { dealerPipe } from './pipes/dealerPipe';
import { HMA } from './indicators/hmaIndicator';
import { HMAKeltnerStrategy } from './strategies/hmaKeltnerStrategy';
import { indicatorsPipe } from './pipes/indicatorsPipe';
import { InstrumentInterface } from './typings/instument.interface';
import { /* parseTickLine ,*/ parseBarLine } from './parsers/csvParser';
import { streamBarsFromFile } from './services/barEmitterService';
import { strategyPipe } from './pipes/strategyPipe';

program
  .option('-i, --history <path>', 'path to history ticks data file')
  .option('-s, --strategy <path>', 'path to history ticks data file');
program.parse(process.argv);

if (!program.history) {
  console.log(
    'The history ticks data file must be specified. Type -h for help.',
  );
} else {
  const { history } = program.opts();
  const instrument = { symbol: 'US500', pip: 0.01 } as InstrumentInterface;
  //const observable = streamDataFromFile(history, parseTickLine);
  const observable = streamBarsFromFile(history, parseBarLine).pipe(
    indicatorsPipe([
      { indicator: HMA, options: { key: 'HMA50', period: 50 } },
      { indicator: ATR, options: { key: 'ATR50', period: 50 } },
    ]),
    strategyPipe(instrument, HMAKeltnerStrategy),
    dealerPipe(backtestBroker),
  );

  let barNum = 0;
  let orderNum = 0;
  observable.subscribe(obj => {
    barNum += 1;
    orderNum += obj.decisions ? obj.decisions.length : 0;
    console.log(barNum, orderNum, obj);
  });
}
