import { parseLine } from '../../src/parsers/csvParser';

describe('svParser', () => {

  it('Parses tick string "10/31/2014,16:20:00.000,17390.52" correctly', () => {
    const tick = parseLine('10/31/2014,16:20:00.000,17390.52');
    expect(tick).toEqual({ timestamp: 1414772400000, price: 17390.52 });
  });
});
