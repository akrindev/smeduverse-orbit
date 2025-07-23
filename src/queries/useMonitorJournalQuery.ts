
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MonitorJournal } from "@/types/monitor";

const getTodayJournal = async () => {
  const res = await api.get("/modul/presence/monitor/today");
  return res.data;
};

export const useMonitorJournalQuery = (refetchInterval: number) => {
  const todayJournalQuery = useQuery<MonitorJournal>({
    queryKey: ["today-journal"],
    queryFn: getTodayJournal,
    refetchInterval,
  });

  return { todayJournalQuery };
};
