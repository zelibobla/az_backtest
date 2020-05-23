import TickInterface from '../typings/tick.interface';
import BarInterface from '../typings/bar.interface';
import * as moment from 'moment';

const parseTickLine = (line: string): TickInterface => {
  const parts = line.split(',');
  const time = moment.utc(`${parts[0]}_${parts[1]}`, 'MM/DD/YYYY_HH:mm:ss.SSS');
  return { price: +parts[2], timestamp: time.valueOf() };
};

const parseBarLine = (line: string): BarInterface => {
  const parts = line.split(',');
  const time = moment.utc(`${parts[0]}`, 'YYYY-MM-DD HH:mm:ss');
  const open = +parts[1];
  const high = +parts[2];
  const low = +parts[3];
  const close = +parts[4];
  return {
    open,
    high,
    low,
    close,
    original_date: parts[0],
    timestamp: time.valueOf(),
  };
};

export { parseTickLine, parseBarLine };
