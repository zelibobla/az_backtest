import TickInterface from '../typings/tick.interface';
import * as moment from 'moment';

const parseLine = (line: string): TickInterface => {
  const parts = line.split(',');
  const time = moment.utc(`${parts[0]}_${parts[1]}`, 'MM/DD/YYYY_HH:mm:ss.SSS');
  return { price: +parts[2], timestamp: time.valueOf() };
}

export {
  parseLine,
}