import { OrderDirectionEnum, OrderTypeEnum } from './order.interface';

export interface DecisionInterface {
  direction: OrderDirectionEnum;
  type: OrderTypeEnum;
  stopLoss?: number;
  takeProfit?: number;
}
