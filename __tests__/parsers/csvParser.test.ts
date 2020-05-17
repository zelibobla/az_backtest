import { parseTickLine, parseBarLine } from '../../src/parsers/csvParser';

describe('csvParser', () => {
  it('Parses tick string "10/31/2014,16:20:00.000,17390.52" correctly', () => {
    const tick = parseTickLine('10/31/2014,16:20:00.000,17390.52');
    expect(tick).toEqual({ timestamp: 1414772400000, price: 17390.52 });
  });

  it('Parses bar string "2004-03-04 09:36:00,1151.54,1151.71,1151.54,1151.62" correctly', () => {
    const bar = parseBarLine(
      '2004-03-04 09:36:00,1151.54,1151.71,1151.54,1151.62',
    );
    expect(bar).toEqual({
      timestamp: 1078392960000,
      open: 1151.54,
      high: 1151.71,
      low: 1151.54,
      close: 1151.62,
    });
  });
});
