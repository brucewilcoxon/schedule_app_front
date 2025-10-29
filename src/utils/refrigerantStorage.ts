import { RefrigerantUsageLog } from "../types/Refrigerant";

const STORAGE_KEY = "refrigerantUsageLogs";
const EVENT_NAME = "refrigerant-usage-updated";

export const loadLogs = (): RefrigerantUsageLog[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as RefrigerantUsageLog[]) : [];
	} catch {
		return [];
	}
};

const saveLogs = (logs: RefrigerantUsageLog[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
	document.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const addLog = (entry: RefrigerantUsageLog) => {
	const logs = loadLogs();
	logs.push(entry);
	saveLogs(logs);
};

export const updateLog = (id: number, values: Partial<RefrigerantUsageLog>) => {
	const logs = loadLogs();
	const updated = logs.map((log) => (log.id === id ? { ...log, ...values } : log));
	saveLogs(updated);
};

export const removeLog = (id: number) => {
	const logs = loadLogs();
	const filtered = logs.filter((log) => log.id !== id);
	saveLogs(filtered);
};

export const subscribeLogs = (listener: () => void) => {
	const handler = () => listener();
	document.addEventListener(EVENT_NAME, handler);
	return () => document.removeEventListener(EVENT_NAME, handler);
}; 