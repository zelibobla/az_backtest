import { streamTicksFromFile } from '../../src/services/tickEmitterService';

describe('streamTicksFromFile', () => {

  it('Reads the file and merges chunks', done => new Promise(resolve => {
      let ticks = [];
      const observable = streamTicksFromFile('./assets/DJ.csv');
      observable.subscribe(
        t => {
          console.log('>>>', t);
          ticks = [...ticks, ...t];
        },
        () => resolve(ticks),
      );
    }).then((result) => {
      const ticks = result as Array<any>;
      const brokenTick = ticks.find(t => !t.timestamp || !t.price);
      expect(brokenTick).toBeUndefined();
      done();
    })
  );

  it(`Throws exception if file doesn't exist`, done => {
    const observable = streamTicksFromFile('fileThatDoesntExist.csv');
    observable.subscribe(
      undefined,
      e => {
        expect(e.code).toEqual('ENOENT');
        done();
      },
    );
  });

});
