import { program } from 'commander';

import { streamBarsFromFile } from './services/barEmitterService';
import { /* parseTickLine ,*/ parseBarLine } from './parsers/csvParser';
import { HMA } from './indicators/hmaIndicator';
import { ATR } from './indicators/atrIndicator';
import { indicatorPipe } from './pipes/indicatorPipe';

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
  //const observable = streamDataFromFile(history, parseTickLine);
  const observable = streamBarsFromFile(history, parseBarLine).pipe(
    indicatorPipe(HMA, { key: 'HMA50', period: 50 }),
    indicatorPipe(ATR, { key: 'ATR50', period: 50 }),
  );

  observable.subscribe(bar => {
    console.log('>>>', bar);
  });
}
