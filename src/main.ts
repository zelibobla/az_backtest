import { program } from 'commander';
import { streamTicksFromFile } from './services/tickEmitterService'; 

program
  .option('-i, --history <path>', 'path to history ticks data file')
  .option('-s, --strategy <path>', 'path to history ticks data file');
program.parse(process.argv);

if (!program.history) {
  console.log('The history ticks data file must be specified. Type -h for help.');
} else {
  const { history } = program.opts();
  const observable = streamTicksFromFile(history);
  observable.subscribe(console.log);
}
