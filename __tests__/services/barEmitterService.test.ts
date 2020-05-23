import { Observable } from 'rxjs';

import { GranularitySeconds } from '../../src/typings/granularity.enum';
import {
  streamBarsFromTicks,
  streamBarsFromFile,
} from '../../src/services/barEmitterService';
import { ticks, bars as expectedBars } from '../assets/ticks';
import { parseBarLine } from '../../src/parsers/csvParser';

describe('Bars streaming service', () => {
  it('By provided array of ticks emits the bar', done => {
    let ticksObserver;
    const ticksObservable = Observable.create(observer => {
      ticksObserver = observer;
    });
    const observable = streamBarsFromTicks(
      ticksObservable,
      GranularitySeconds.S1,
    );
    let index = 0;
    observable.subscribe(bar => {
      expect(bar).toEqual(expectedBars[index]);
      if (index === expectedBars.length - 1) {
        done();
      }
      index += 1;
    });
    ticksObserver.next(ticks);
  });

  it('Reads the file and merges chunks', done => {
    let bars = [];
    const observable = streamBarsFromFile(
      './__tests__/assets/SPX_bars.csv',
      parseBarLine,
    );
    observable.subscribe(
      bar => {
        bars.push(bar);
      },
      e => done(e),
      () => {
        const brokenBar = bars.find(
          b => !b.timestamp || !b.open || !b.high || !b.low || !b.close,
        );
        expect(brokenBar).toBeUndefined();
        done();
      },
    );
  });
});
