import { Md5 } from 'ts-md5';
import {
  OrderInterface,
  OrderDirectionEnum,
  OrderTypeEnum,
  OrderStatusEnum,
} from '../typings/order.interface';
import { TradeInterface } from '../typings/trade.interface';

const orderFactory = {
  clone: (
    proto: OrderInterface,
    parentHash?: string,
    tradeHash?: string,
  ): OrderInterface => {
    const order = {
      symbol: proto.symbol,
      quantity: proto.quantity,
      direction: proto.direction,
      type: proto.type,
      status: OrderStatusEnum.NEW,
    } as OrderInterface;
    if (parentHash) {
      order.parentHash = parentHash;
    }
    order.hash = Md5.hashStr(
      JSON.stringify(new Date().toString()) + JSON.stringify(order),
    ) as string;
    if (tradeHash) {
      order.tradeHash = tradeHash;
    }
    return order;
  },

  create: (
    direction: OrderDirectionEnum,
    type: OrderTypeEnum,
    price: number,
    symbol: string,
    quantity: number,
    parentHash?: string,
    tradeHash?: string,
  ): OrderInterface => {
    const order = {
      direction,
      type,
      status: OrderStatusEnum.NEW,
    } as OrderInterface;
    order.initialPrice = price;
    order.symbol = symbol;
    order.quantity = quantity;
    order.parentHash = parentHash;
    order.hash = Md5.hashStr(
      JSON.stringify(new Date().toString()) + JSON.stringify(order),
    ) as string;
    order.tradeHash = tradeHash;
    return order;
  },

  createChildren: (
    trade: TradeInterface,
    parent: OrderInterface,
  ): OrderInterface[] => {
    if (parent.parentHash) {
      return [];
    }
    const children = [];
    if (trade.stopLoss) {
      const direction =
        parent.direction === OrderDirectionEnum.BUY
          ? OrderDirectionEnum.SELL
          : OrderDirectionEnum.BUY;
      const stopLoss = orderFactory.create(
        direction,
        OrderTypeEnum.STP,
        trade.stopLoss,
        trade.symbol,
        trade.openOrder.quantity,
        parent.hash,
        trade.hash,
      );
      children.push(stopLoss);
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(stopLoss.hash);
    }
    if (trade.takeProfit) {
      const direction =
        parent.direction === OrderDirectionEnum.BUY
          ? OrderDirectionEnum.SELL
          : OrderDirectionEnum.BUY;
      const takeProfit = orderFactory.create(
        direction,
        OrderTypeEnum.LMT,
        trade.takeProfit,
        trade.symbol,
        trade.openOrder.quantity,
        parent.hash,
        trade.hash,
      );
      children.push(takeProfit);
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(takeProfit.hash);
    }
    return children;
  },
};

export { orderFactory };
