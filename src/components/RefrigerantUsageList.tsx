import React, { useEffect, useMemo, useState } from "react";
import { RefrigerantUsageLog } from "../types/Refrigerant";
import { loadLogs, subscribeLogs } from "../utils/refrigerantStorage";
import EditRefrigerantUsageModal from "./EditRefrigerantUsageModal";
import CSVDownloadModal from "./CSVDownloadModal";
import { 
  CalendarIcon, 
  UploadIcon, 
  FileTextIcon
} from "@radix-ui/react-icons";

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}年${m}月${day}日`;
  } catch {
    return iso;
  }
};

const RefrigerantUsageList: React.FC = () => {
  const [logs, setLogs] = useState<RefrigerantUsageLog[]>(loadLogs());
  const [selected, setSelected] = useState<RefrigerantUsageLog | null>(null);
  const [open, setOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [selectedForCsv, setSelectedForCsv] = useState<RefrigerantUsageLog | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeLogs(() => setLogs(loadLogs()));
    return unsubscribe;
  }, []);

  const totalsByType = useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((log) => {
      const key = log.refrigerantType;
      const total = (log.recoveryAmount || 0) + (log.fillingAmount || 0) + (log.additionalFillingAmount || 0);
      map.set(key, (map.get(key) || 0) + total);
    });
    return Array.from(map.entries());
  }, [logs]);

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [logs]
  );

  const getProjectTypeColor = (projectType: string) => {
    switch (projectType) {
      case "回収": return "bg-orange-100 text-orange-800 border-orange-200";
      case "充填": return "bg-teal-100 text-teal-800 border-teal-200";
      case "回収充填": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProjectTypeIcon = (projectType: string) => {
    switch (projectType) {
      case "回収": return <UploadIcon className="w-4 h-4" />;
      case "充填": return <FileTextIcon className="w-4 h-4" />;
      case "回収充填": return <CalendarIcon className="w-4 h-4" />;
      default: return <FileTextIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="px-3 space-y-6">
      {/* Summary Cards */}
      {totalsByType.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {totalsByType.map(([type, total]) => (
            <div key={type} className="rounded-xl p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border shadow-sm">
              <div className="text-sm text-gray-500 mb-1">冷媒種類</div>
              <div className="text-lg font-bold text-gray-900">{type}</div>
              <div className="text-2xl font-bold mt-2 text-blue-600">{total.toFixed(1)} kg</div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Logs */}
      <div className="space-y-6">
        {sortedLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full border ${getProjectTypeColor(log.projectType)}`}>
                    {getProjectTypeIcon(log.projectType)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{log.projectType}</h3>
                    <p className="text-sm text-gray-600">{formatDate(log.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelected(log);
                      setOpen(true);
                    }}
                  >
                    編集
                  </button>
                  <button
                    className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      setSelectedForCsv(log);
                      setCsvModalOpen(true);
                    }}
                  >
                    CSVダウンロード
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* フロン名称・種類 */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileTextIcon className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-purple-900">フロン名称・種類</h4>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">フロン名称・種類</div>
                  <div className="text-xl font-bold text-purple-700">{log.refrigerantType}</div>
                </div>
              </div>

              {/* 回収作業 */}
              {(log.projectType === "回収" || log.projectType === "回収充填") && log.recoveryAmount && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <UploadIcon className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-semibold text-orange-900">回収作業</h4>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">回収量</div>
                    <div className="text-2xl font-bold text-orange-700">{log.recoveryAmount.toFixed(1)} kg</div>
                  </div>
                </div>
              )}

              {/* 充填作業 */}
              {(log.projectType === "充填" || log.projectType === "回収充填") && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FileTextIcon className="w-5 h-5 text-teal-600" />
                    <h4 className="text-lg font-semibold text-teal-900">充填作業</h4>
                  </div>
                  <div className="space-y-4">
                    {log.fillingDate && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">充填日</div>
                        <div className="text-lg font-semibold text-teal-700">{formatDate(log.fillingDate)}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {log.fillingAmount && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">充填量</div>
                          <div className="text-xl font-bold text-teal-700">{log.fillingAmount.toFixed(1)} kg</div>
                        </div>
                      )}
                      {log.additionalFillingAmount && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">追加充填量</div>
                          <div className="text-xl font-bold text-teal-700">{log.additionalFillingAmount.toFixed(1)} kg</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 漏れ量計算結果 */}
              {log.projectType === "回収充填" && log.leakageAmount !== undefined && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FileTextIcon className="w-5 h-5 text-red-600" />
                    <h4 className="text-lg font-semibold text-red-900">漏れ量計算結果</h4>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-1">計算式: 充填量 + 追加充填量 - 回収量</div>
                    <div className="text-2xl font-bold text-red-700">
                      漏れ量: {log.leakageAmount?.toFixed(1) || 0} kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({(log.fillingAmount || 0)} + {(log.additionalFillingAmount || 0)} - {(log.recoveryAmount || 0)})
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {sortedLogs.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            <FileTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg">まだ記録がありません。</p>
            <p className="text-sm">+ ボタンを使用して記録を追加してください。</p>
          </div>
        )}
      </div>

      <EditRefrigerantUsageModal open={open} onClose={() => setOpen(false)} log={selected} />
      <CSVDownloadModal open={csvModalOpen} onClose={() => setCsvModalOpen(false)} log={selectedForCsv} />
    </div>
  );
};

export default RefrigerantUsageList; 