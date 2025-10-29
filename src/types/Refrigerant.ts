export interface RefrigerantUsageLog {
  id: number;
  projectType: string; // 項目: 回収, 充填, 回収充填
  date: string; // 月日
  refrigerantType: string; // フロン名称・種類 (combined)
  recoveryAmount?: number; // 回収量
  fillingDate?: string; // 充填日
  fillingAmount?: number; // 充填量
  additionalFillingAmount?: number; // 追加充填量
  leakageAmount?: number; // 漏れ量 (calculated)
  gwpValue?: number; // GWP value for the refrigerant type
}

// GWP values for each refrigerant type
export const REFRIGERANT_GWP_VALUES: Record<string, number> = {
  "R452A": 2140,
  "R513a": 631,
  "R32 (HFO)": 675,
  "R410A": 2088,
  "R408A": 3150,
  "R407C (HFC)": 1774,
}; 