import { program } from 'commander';

import { streamBarsFromFile } from './services/barEmitterService';
import { /* parseTickLine ,*/ parseBarLine } from './parsers/csvParser';
import { HMA } from './indicators/hmaIndicator';
import { ATR } from './indicators/atrIndicator';
import { indicatorPipe } from './pipes/indicatorPipe';
import { strategyPipe } from './pipes/strategyPipe';
import { HMAKeltnerStrategy } from './strategies/hmaKeltnerStrategy';
import { InstrumentInterface } from './typings/instument.interface';

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
  const instrument = { pip: 0.01 } as InstrumentInterface;
  //const observable = streamDataFromFile(history, parseTickLine);
  const observable = streamBarsFromFile(history, parseBarLine).pipe(
    indicatorPipe(HMA, { key: 'HMA50', period: 50 }),
    indicatorPipe(ATR, { key: 'ATR50', period: 50 }),
    strategyPipe(instrument, HMAKeltnerStrategy),
  );

  let barNum = 0;
  let orderNum = 0;
  observable.subscribe(obj => {
    barNum += 1;
    orderNum += obj.decisions.length;
    console.log(barNum, orderNum, obj, obj.decisions);
  });
}
