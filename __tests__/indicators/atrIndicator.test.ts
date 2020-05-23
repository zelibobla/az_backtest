import { bars } from '../assets/atr';

import { ATR } from '../../src/indicators/atrIndicator';
import BarInterface from '../../src/typings/bar.interface';

describe('ATR Indicator', () => {
  it('Should calculate as expected', done => {
    const inputBars = JSON.parse(JSON.stringify(bars)) as BarInterface[];
    ATR.calc(inputBars, 5)
      .then(values => {
        values.forEach((value, index) => {
          const indicators = inputBars[index + 4].indicators as any;
          expect(Math.round(value * 100) / 100).toEqual(indicators.atr);
        });
        done();
      })
      .catch(done);
  });
});
