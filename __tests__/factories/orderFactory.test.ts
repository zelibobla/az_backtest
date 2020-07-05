import { orderFactory } from '../../src/factories/orderFactory';
import {
  OrderDirectionEnum,
  OrderTypeEnum,
  OrderStatusEnum,
  OrderInterface,
} from '../../src/typings/order.interface';
import { TradeInterface } from '../../src/typings/trade.interface';

describe('OrderFactory', () => {
  it('Should create order', () => {
    const price = 10;
    const symbol = 'DOW';
    const quantity = 1;
    const order = orderFactory.create(
      OrderDirectionEnum.BUY,
      OrderTypeEnum.MKT,
      price,
      symbol,
      quantity,
    );
    expect(order.direction).toEqual(OrderDirectionEnum.BUY);
    expect(order.type).toEqual(OrderTypeEnum.MKT);
    expect(order.initialPrice).toEqual(price);
    expect(order.symbol).toEqual(symbol);
    expect(order.quantity).toEqual(quantity);
  });

  it('Should clone order', () => {
    const original = {
      status: OrderStatusEnum.FILLED,
      type: OrderTypeEnum.MKT,
      tradeHash: 'tradeHash',
      hash: 'orderHash',
      symbol: 'DOW',
      quantity: 1,
      direction: OrderDirectionEnum.BUY,
      initialPrice: 7,
      parentHash: 'parentHash',
    } as OrderInterface;
    const newParentHash = 'anotherParentHash';
    const newTradeHash = 'newTradeHash';
    const clone = orderFactory.clone(original, newParentHash, newTradeHash);
    expect(clone.direction).toEqual(original.direction);
    expect(clone.type).toEqual(original.type);
    expect(clone.symbol).toEqual(original.symbol);
    expect(clone.quantity).toEqual(original.quantity);
    expect(clone.tradeHash).toEqual(newTradeHash);
    expect(clone.parentHash).toEqual(newParentHash);
    expect(clone.initialPrice).toBeUndefined();
    expect(clone.hash === original.hash).toBeFalsy();
    expect(clone.status).toEqual(OrderStatusEnum.NEW);
  });

  it('Should create children', () => {
    const parent = {
      status: OrderStatusEnum.NEW,
      type: OrderTypeEnum.MKT,
      tradeHash: 'tradeHash',
      hash: 'orderHash',
      symbol: 'DOW',
      quantity: 1,
      direction: OrderDirectionEnum.BUY,
      initialPrice: 7,
    } as OrderInterface;
    const trade = {
      stopLoss: 5,
      takeProfit: 10,
      symbol: 'DOW',
      openOrder: parent,
    } as TradeInterface;
    const children = orderFactory.createChildren(trade, parent);
    expect(children.length).toEqual(2);
    expect(parent.children.length).toEqual(2);
    const takeProfit = children[1];
    expect(takeProfit.direction).toEqual(OrderDirectionEnum.SELL);
    expect(takeProfit.type).toEqual(OrderTypeEnum.LMT);
    expect(takeProfit.initialPrice).toEqual(trade.takeProfit);
    expect(takeProfit.symbol).toEqual(trade.symbol);
    expect(takeProfit.quantity).toEqual(trade.openOrder.quantity);
    const stopLoss = children[0];
    expect(stopLoss.direction).toEqual(OrderDirectionEnum.SELL);
    expect(stopLoss.type).toEqual(OrderTypeEnum.STP);
    expect(stopLoss.initialPrice).toEqual(trade.stopLoss);
    expect(stopLoss.symbol).toEqual(trade.symbol);
    expect(stopLoss.quantity).toEqual(trade.openOrder.quantity);
  });

  it('Should not create children if parent is a child itself', () => {
    const parent = {
      status: OrderStatusEnum.NEW,
      type: OrderTypeEnum.MKT,
      tradeHash: 'tradeHash',
      parentHash: 'parentHash',
      hash: 'orderHash',
      symbol: 'DOW',
      quantity: 1,
      direction: OrderDirectionEnum.BUY,
      initialPrice: 7,
    } as OrderInterface;
    const trade = {
      stopLoss: 5,
      takeProfit: 10,
      symbol: 'DOW',
      openOrder: parent,
    } as TradeInterface;
    const children = orderFactory.createChildren(trade, parent);
    expect(children.length).toEqual(0);
  });
  it('Should not create children if no children specified', () => {
    const parent = {
      status: OrderStatusEnum.NEW,
      type: OrderTypeEnum.MKT,
      tradeHash: 'tradeHash',
      parentHash: 'parentHash',
      hash: 'orderHash',
      symbol: 'DOW',
      quantity: 1,
      direction: OrderDirectionEnum.BUY,
      initialPrice: 7,
    } as OrderInterface;
    const trade = {
      symbol: 'DOW',
      openOrder: parent,
    } as TradeInterface;
    const children = orderFactory.createChildren(trade, parent);
    expect(children.length).toEqual(0);
  });
});
