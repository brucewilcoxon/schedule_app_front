export interface GasType {
  id?: number;
  gas_type: string; // ガスの種類
  quantity: number; // 数量
  date: string; // 日付
  prefecture: string; // 入庫都道府県
  process: GasProcess; // ガス処理（回収、充填、再充填）
  created_at?: string;
  updated_at?: string;
}

export type GasProcess = 'recovery' | 'filling' | 'refilling';

export interface GasProcessOption {
  value: GasProcess;
  label: string;
}

export interface GasSummary {
  recovery: number; // 回収
  filling: number; // 充填
  refilling: number; // 再充填
  total: number; // 合計
}

export interface GasFilter {
  start_date?: string;
  end_date?: string;
  gas_type?: string;
  prefecture?: string;
  process?: GasProcess;
}

export interface GasDailyData {
  date: string;
  total: number;
  items: GasType[];
}

export interface GasApiResponse {
  data: GasType[];
  summary: GasSummary;
  daily_data: GasDailyData[];
}
