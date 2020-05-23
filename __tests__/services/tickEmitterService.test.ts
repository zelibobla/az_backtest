import { streamTicksFromFile } from '../../src/services/tickEmitterService';
import { parseTickLine } from '../../src/parsers/csvParser';

describe('streamTicksFromFile', () => {
  it('Reads the file and merges chunks', done =>
    new Promise((resolve, reject) => {
      let ticks = [];
      const observable = streamTicksFromFile(
        './__tests__/assets/DJ_ticks.csv',
        parseTickLine,
      );
      observable.subscribe(
        t => (ticks = [...ticks, ...t]),
        e => reject(e),
        () => resolve(ticks),
      );
    }).then(result => {
      const ticks = result as Array<any>;
      const brokenTick = ticks.find(t => !t.timestamp || !t.price);
      expect(brokenTick).toBeUndefined();
      done();
    }));

  it(`Throws exception if file doesn't exist`, done => {
    const observable = streamTicksFromFile(
      'fileThatDoesntExist.csv',
      parseTickLine,
    );
    observable.subscribe(undefined, e => {
      expect(e.code).toEqual('ENOENT');
      done();
    });
  });
});
