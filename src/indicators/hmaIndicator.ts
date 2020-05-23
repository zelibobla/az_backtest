import * as tulind from 'tulind';
import BarInterface from '../typings/bar.interface';

const HMA = {
  calc: (bars: Array<BarInterface>, period: number): Promise<Array<number>> =>
    new Promise((resolve, reject) => {
      const prices = bars.map(b => b.close);
      tulind.indicators.hma.indicator([prices], [period], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0]);
      });
    }),
};

export { HMA };
