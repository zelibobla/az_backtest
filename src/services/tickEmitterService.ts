import { createReadStream, ReadStream } from 'fs';
import { Observable } from 'rxjs';
import { resolve } from 'path';

import { parseLine } from '../parsers/csvParser';
import TickInterface from '../typings/tick.interface';

const readFileInStream = (path: string): ReadStream => {
  const fullFilename = resolve(path);
  return createReadStream(fullFilename, 'utf-8');
}

const streamTicks = (stream: ReadStream) => Observable.create(observer => {
  stream.on('end', () => observer.complete());
  stream.on('close', () => observer.complete());
  stream.on('error', e => observer.error(e));
  let tail;
  stream.on('data', data => {
    const lines = data.split('\n');
    lines[0] = `${tail}${lines[0]}`;
    tail = lines.pop();
    const ticks = lines.map(parseLine);
    observer.next(ticks);
  });

  return observer.pause;
});

const streamTicksFromFile = (path:string): Observable<TickInterface[]> => 
  streamTicks(readFileInStream(path))

export { streamTicksFromFile };