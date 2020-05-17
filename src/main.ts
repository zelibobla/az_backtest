import { program } from 'commander';
import { streamDataFromFile } from './services/fileService';
import { /* parseTickLine ,*/ parseBarLine } from './parsers/csvParser';

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
  const observable = streamDataFromFile(history, parseBarLine);
  observable.subscribe(console.log);
}
