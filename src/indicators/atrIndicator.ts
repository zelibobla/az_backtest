import * as tulind from 'tulind';
import BarInterface from '../typings/bar.interface';

const ATR = {
  calc: (bars: Array<BarInterface>, period: number): Promise<Array<number>> =>
    new Promise((resolve, reject) => {
      const inputs = bars.reduce(
        (memo, bar) => {
          memo[0].push(bar.high);
          memo[1].push(bar.low);
          memo[2].push(bar.close);
          return memo;
        },
        [[], [], []],
      );
      tulind.indicators.atr.indicator(inputs, [period], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0]);
      });
    }),
};

export { ATR };
