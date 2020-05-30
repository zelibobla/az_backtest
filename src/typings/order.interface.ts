export enum OrderDirectionEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderTypeEnum {
  MKT = 'MKT',
}

export interface OrderInterface {
  direction: OrderDirectionEnum;
  type: OrderTypeEnum;
  stopLoss?: number;
  takeProfit?: number;
}
