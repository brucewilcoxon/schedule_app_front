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
  "R134a HFC": 1300,
  "R404A HFC": 3940,
  "R22 HCFC": 1760,
  "R403B HFC": 3680,
  "R502 CFC": 4660,
  "R12 CFC": 1810,
}; 