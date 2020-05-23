import { Observable, Observer } from 'rxjs';

import { streamDataFromFile } from './fileService';
import BarInterface from '../typings/bar.interface';
import { GranularitySeconds } from '../typings/granularity.enum';
import TickInterface from '../typings/tick.interface';

let ticksCollection = <TickInterface[]>[];
let currentBar: BarInterface;

const createBar = (
  tick: TickInterface,
  granularity: GranularitySeconds,
): BarInterface => {
  return {
    timestamp: tick.timestamp - (tick.timestamp % (granularity * 1000)),
    open: tick.price,
    high: tick.price,
    low: tick.price,
    close: tick.price,
  } as BarInterface;
};

const createFakeBars = (
  currentBar: BarInterface,
  timestamp: number,
  granularity: GranularitySeconds,
) => {
  const bars = [];
  const fakeTick = {
    timestamp: currentBar.timestamp + granularity * 1000,
    price: currentBar.close,
  };
  while (fakeTick.timestamp + granularity * 1000 < timestamp) {
    bars.push(createBar(fakeTick, granularity));
    fakeTick.timestamp += granularity * 1000;
  }
  return bars;
};

const emitBarByTicks = (
  observer: Observer<BarInterface>,
  granularity: GranularitySeconds,
): void => {
  if (!currentBar) {
    currentBar = createBar(ticksCollection[0], granularity);
  }
  ticksCollection.forEach(tick => {
    const duration = Math.floor(tick.timestamp - currentBar.timestamp) / 1000;
    if (duration > granularity) {
      observer.next({ ...currentBar });
      createFakeBars(currentBar, tick.timestamp, granularity).forEach(bar =>
        observer.next({ ...bar }),
      );
      currentBar = createBar(tick, granularity);
    }
    currentBar.high =
      tick.price > currentBar.high ? tick.price : currentBar.high;
    currentBar.low = tick.price < currentBar.low ? tick.price : currentBar.low;
    currentBar.close = tick.price;
  });
};

const streamBarsFromTicks = (
  ticksEmitter: Observable<TickInterface[]>,
  granularity: GranularitySeconds,
): Observable<BarInterface> => {
  const observable = Observable.create(observer => {
    ticksEmitter.subscribe(
      ticks => {
        ticksCollection = [...ticksCollection, ...ticks];
        emitBarByTicks(observer as Observer<BarInterface>, granularity);
      },
      observer.error,
      observer.complete,
    );
  });
  return observable;
};

const streamBarsFromFile = (
  file: string,
  parseLine: Function,
): Observable<BarInterface> => {
  const observable = Observable.create(observer => {
    streamDataFromFile(file, parseLine).subscribe(
      bars => bars.forEach(bar => observer.next(bar)),
      observer.error,
      () => observer.complete(),
    );
  });
  return observable;
};

export { streamBarsFromTicks, streamBarsFromFile };
