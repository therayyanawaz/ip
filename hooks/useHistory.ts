import { useState, useEffect } from "react";
import type { HistoryRecord, User, Address } from "@/app/types";

const generateId = () =>
  `history-${Date.now()}-${Math.random().toString(36).substring(2)}`;

interface UseHistoryReturn {
  history: HistoryRecord[];
  selectedHistory: string;
  setSelectedHistory: (id: string) => void;
  addHistoryRecord: (params: {
    user: User;
    address: Address;
    ip: string;
  }) => void;
  deleteHistoryRecord: (id: string) => void;
  deleteAllHistory: () => void;
}

export default function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string>("");

  // Load history records from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("addressHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Ensure all records have valid IDs
        const validHistory = parsedHistory.map((record: HistoryRecord) => ({
          ...record,
          id:
            record.id && record.id.startsWith("history-")
              ? record.id
              : generateId(),
        }));
        setHistory(validHistory);
      } catch (e) {
        console.error("Failed to parse history:", e);
        setHistory([]);
      }
    }
  }, []);

  // Save history records to localStorage
  useEffect(() => {
    localStorage.setItem("addressHistory", JSON.stringify(history));
  }, [history]);

  const addHistoryRecord = ({
    user,
    address,
    ip,
  }: {
    user: User;
    address: Address;
    ip: string;
  }) => {
    const timestamp = Date.now();
    const newRecord: HistoryRecord = {
      id: `history-${timestamp}-${Math.random().toString(36).substring(2)}`,
      user,
      address,
      ip,
      timestamp,
    };

    setHistory((prev) => {
      const isDuplicate = prev.some((record) => record.id === newRecord.id);
      if (isDuplicate) {
        newRecord.id = `history-${timestamp}-${Math.random()
          .toString(36)
          .substring(2)}`;
      }
      return [newRecord, ...prev.slice(0, 19)];
    });
    setSelectedHistory(newRecord.id);
  };

  const deleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((record) => record.id !== id));
    if (selectedHistory === id) {
      setSelectedHistory("");
    }
  };

  const deleteAllHistory = () => {
    setHistory([]);
    setSelectedHistory("");
  };

  return {
    history,
    selectedHistory,
    setSelectedHistory,
    addHistoryRecord,
    deleteHistoryRecord,
    deleteAllHistory,
  };
}
