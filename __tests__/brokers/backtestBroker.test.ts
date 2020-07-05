import BarInterface from '../../src/typings/bar.interface';
import { backtestBroker } from '../../src/brokers/backtestBroker';
import { StrategyStateInterface } from '../../src/typings/strategy.interface';
import {
  OrderInterface,
  OrderStatusEnum,
  OrderTypeEnum,
  OrderDirectionEnum,
} from '../../src/typings/order.interface';

const symbol = 'DOW';
let order, bar, trade, state;

describe('BacktestBroker', () => {
  beforeEach(() => {
    order = {
      status: OrderStatusEnum.NEW,
      type: OrderTypeEnum.MKT,
      tradeHash: 'tradeHash',
      hash: 'orderHash',
      symbol: symbol,
      quantity: 1,
      direction: OrderDirectionEnum.BUY,
      initialPrice: 7,
    } as OrderInterface;

    trade = {
      hash: 'tradeHash',
    };

    state = {
      orders: new Map().set(order.hash, order),
      positions: new Map([[symbol, 1]]),
      trades: [trade],
    } as StrategyStateInterface;

    bar = {
      open: 3,
      high: 10,
      low: 5,
      close: 6,
    } as BarInterface;
  });
  it('Should set NEW order to PENDING', done => {
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.PENDING);
        done();
      })
      .catch(done);
  });
  it('Should set PENDING MKT order to FILLED and filledPrice should equal to current', done => {
    order.status = OrderStatusEnum.PENDING;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.FILLED);
        expect(order.filledPrice).toEqual(bar.close);
        done();
      })
      .catch(done);
  });
  it('Should keep PENDING SELL LMT order as PENDING when current price is lower than limit', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.LMT;
    order.direction = OrderDirectionEnum.SELL;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.PENDING);
        done();
      })
      .catch(done);
  });
  it('Should set PENDING SELL LMT order to FILLED when current price is higher than limit', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.LMT;
    order.direction = OrderDirectionEnum.SELL;
    bar.close = 12;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.FILLED);
        expect(order.filledPrice).toEqual(bar.close);
        done();
      })
      .catch(done);
  });
  it('Should keep PENDING SELL STP order as PENDING when current price is higher than stop', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.STP;
    order.direction = OrderDirectionEnum.SELL;
    bar.close = 12;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.PENDING);
        done();
      })
      .catch(done);
  });
  it('Should set PENDING SELL STP order to FILLED when current price is lower than stop', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.STP;
    order.direction = OrderDirectionEnum.SELL;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.FILLED);
        expect(order.filledPrice).toEqual(bar.close);
        done();
      })
      .catch(done);
  });
  it('Should keep PENDING BUY LMT order as PENDING when current price is higher than limit', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.LMT;
    order.direction = OrderDirectionEnum.BUY;
    bar.close = 12;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.PENDING);
        done();
      })
      .catch(done);
  });
  it('Should set PENDING BUY LMT order to FILLED when current price is lower than limit', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.LMT;
    order.direction = OrderDirectionEnum.BUY;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.FILLED);
        expect(order.filledPrice).toEqual(bar.close);
        done();
      })
      .catch(done);
  });
  it('Should keep PENDING BUY STP order as PENDING when current price is lower than stop', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.STP;
    order.direction = OrderDirectionEnum.BUY;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.PENDING);
        done();
      })
      .catch(done);
  });
  it('Should set PENDING BUY STP order to FILLED when current price is higher than stop', done => {
    order.status = OrderStatusEnum.PENDING;
    order.type = OrderTypeEnum.STP;
    order.direction = OrderDirectionEnum.BUY;
    bar.close = 12;
    backtestBroker
      .watch(state, bar)
      .then(() => {
        expect(order.status).toEqual(OrderStatusEnum.FILLED);
        expect(order.filledPrice).toEqual(bar.close);
        done();
      })
      .catch(done);
  });
});
