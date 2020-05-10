import { Observable } from 'rxjs';

import { GranularitySeconds } from '../../src/typings/granularity.enum';
import { streamBarsFromTicks } from '../../src/services/barEmitterService';
import { ticks, bars as expectedBars } from '../assets/ticks';


describe('Bars streaming service', () => {

  it('By provided array of ticks emits the bar', done => {
    let ticksObserver;
    const ticksObservable = Observable.create(observer => {
      ticksObserver = observer;
    });
    const observable = streamBarsFromTicks(ticksObservable, GranularitySeconds.S1);
    let index = 0;
    observable.subscribe(
      bar => {
        expect(bar).toEqual(expectedBars[index]);     
        if (index === expectedBars.length - 1) {
          done();
        }
        index += 1;
      },
    );
    ticksObserver.next(ticks);
  });

});
