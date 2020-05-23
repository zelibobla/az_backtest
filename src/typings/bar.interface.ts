export default interface BarInterface {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  indicators?: Map<string, number>;
  original_date?: string;
  value?: number;
}
