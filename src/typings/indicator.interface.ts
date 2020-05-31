export interface IndicatorSettingsInterface {
  indicator: IndicatorInterface;
  options: IndicatorParamsInterface;
}

export interface IndicatorInterface {
  calc: Function;
}

export interface IndicatorParamsInterface {
  key: string;
  period: number;
}
