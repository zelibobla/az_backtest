import { Md5 } from 'ts-md5';
import { OrderDirectionEnum, OrderTypeEnum } from '../typings/order.interface';
import { orderFactory } from './orderFactory';
import { TradeInterface, TradeStatusEnum } from '../typings/trade.interface';

const tradeFactory = {
  create: (
    direction: OrderDirectionEnum,
    type: OrderTypeEnum,
    symbol: string,
    quantity: number,
    price: number,
    stopLoss?: number,
    takeProfit?: number,
  ): TradeInterface => {
    const openOrder = orderFactory.create(
      direction,
      type,
      price,
      symbol,
      quantity,
    );
    const trade = {
      symbol,
      openOrder,
      status: TradeStatusEnum.PENDING,
      stopLoss,
      takeProfit,
    } as TradeInterface;
    trade.hash = Md5.hashStr(
      JSON.stringify(new Date().toString()) + JSON.stringify(trade),
    ) as string;
    trade.openOrder.tradeHash = trade.hash;
    return trade;
  },
};

export { tradeFactory };
