import { createReadStream, ReadStream } from 'fs';
import { Observable } from 'rxjs';
import { resolve } from 'path';

const readFileInStream = (path: string): ReadStream => {
  const fullFilename = resolve(path);
  return createReadStream(fullFilename, 'utf-8');
};

const streamData = (stream: ReadStream, parseLine: Function) =>
  Observable.create(observer => {
    stream.on('end', () => observer.complete());
    stream.on('close', () => observer.complete());
    stream.on('error', e => observer.error(e));
    let tail;
    stream.on('data', data => {
      const lines = data.split('\n');
      lines[0] = `${tail}${lines[0]}`;
      tail = lines.pop();
      const parsedLines = lines.map(parseLine);
      observer.next(parsedLines);
    });

    return observer.pause;
  });

const streamDataFromFile = (
  path: string,
  parseLine: Function,
): Observable<any> => streamData(readFileInStream(path), parseLine);

export { streamDataFromFile };
