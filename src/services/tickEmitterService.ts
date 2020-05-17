import { streamDataFromFile } from './fileService';

const streamTicksFromFile = (file: string, parseLine: Function) =>
  streamDataFromFile(file, parseLine);

export { streamTicksFromFile };
