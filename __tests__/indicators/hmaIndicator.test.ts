import { round10 } from 'round10';

import { bars } from '../assets/hma';
import { HMA } from '../../src/indicators/hmaIndicator';
import BarInterface from '../../src/typings/bar.interface';

describe('HMA Indicator', () => {
  it('Should calculate as expected', done => {
    const inputBars = JSON.parse(JSON.stringify(bars)) as BarInterface[];
    HMA.calc(inputBars, 5)
      .then(values => {
        values.forEach((value, index) => {
          const indicators = inputBars[index + 5].indicators as any;
          expect(round10(value, -2)).toEqual(indicators.hma);
        });
        done();
      })
      .catch(done);
  });
});
