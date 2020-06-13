import { Md5 } from 'ts-md5';
import {
  OrderInterface,
  OrderDirectionEnum,
  OrderTypeEnum,
  OrderStatusEnum,
} from '../typings/order.interface';

const orderFactory = {
  create: (
    direction: OrderDirectionEnum,
    type: OrderTypeEnum,
    price: number,
    stopLoss?: number,
    takeProfit?: number,
    parent?: string,
  ): OrderInterface => {
    const order = {
      direction,
      type,
      status: OrderStatusEnum.NEW,
    } as OrderInterface;
    if (stopLoss !== undefined) {
      order.stopLoss = stopLoss;
    }
    if (takeProfit !== undefined) {
      order.takeProfit = takeProfit;
    }
    if (parent) {
      order.parent = parent;
    }
    order.initialPrice = price;
    order.hash = Md5.hashStr(
      JSON.stringify(new Date().toString()) + JSON.stringify(order),
    ) as string;
    return order;
  },

  createChildren: (order: OrderInterface): OrderInterface[] => {
    const children = [];
    if (order.stopLoss) {
      const direction =
        order.direction === OrderDirectionEnum.BUY
          ? OrderDirectionEnum.SELL
          : OrderDirectionEnum.BUY;
      const stopLoss = orderFactory.create(
        direction,
        OrderTypeEnum.STP,
        order.stopLoss,
      );
      stopLoss.parent = order.hash;
      children.push(stopLoss);
      if (!order.children) {
        order.children = [];
      }
      order.children.push(stopLoss.hash);
    }
    if (order.takeProfit) {
      const direction =
        order.direction === OrderDirectionEnum.BUY
          ? OrderDirectionEnum.SELL
          : OrderDirectionEnum.BUY;
      const takeProfit = orderFactory.create(
        direction,
        OrderTypeEnum.LMT,
        order.takeProfit,
      );
      takeProfit.parent = order.hash;
      children.push(takeProfit);
      if (!order.children) {
        order.children = [];
      }
      order.children.push(takeProfit.hash);
    }
    return children;
  },
};

export { orderFactory };
