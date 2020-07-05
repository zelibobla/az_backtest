import {
  OrderDirectionEnum,
  OrderTypeEnum,
} from '../../src/typings/order.interface';
import { TradeStatusEnum } from '../../src/typings/trade.interface';
import { tradeFactory } from '../../src/factories/tradeFactory';

describe('TradeFactory', () => {
  it('Should create trade', () => {
    const price = 10;
    const symbol = 'DOW';
    const quantity = 1;
    const trade = tradeFactory.create(
      OrderDirectionEnum.BUY,
      OrderTypeEnum.MKT,
      symbol,
      quantity,
      price,
    );
    expect(trade.symbol).toEqual(symbol);
    expect(trade.status).toEqual(TradeStatusEnum.PENDING);
    expect(trade.openOrder.direction).toEqual(OrderDirectionEnum.BUY);
    expect(trade.openOrder.type).toEqual(OrderTypeEnum.MKT);
    expect(trade.openOrder.initialPrice).toEqual(price);
    expect(trade.openOrder.quantity).toEqual(quantity);
  });
});
