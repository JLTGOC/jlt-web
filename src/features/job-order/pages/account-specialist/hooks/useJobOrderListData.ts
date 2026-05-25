import { useMemo } from "react";
import type {
  JobOrderListItem,
  JobOrderServiceType,
} from "../../../types/jobOrder";

type UseJobOrderListDataParams = {
  data: JobOrderListItem[];
  activeTab: "all" | JobOrderServiceType;
  search: string;
  tradeType: string;
  status: string;
  personInCharge: string;
  perPage: number;
  page: number;
};

type UseJobOrderListDataResult = {
  filteredData: JobOrderListItem[];
  pagedData: JobOrderListItem[];
  counts: { all: number; Logistics: number; Regulatory: number };
  totalPages: number;
  pages: Array<number | "...">;
};

export function useJobOrderListData({
  data,
  activeTab,
  search,
  tradeType,
  status,
  personInCharge,
  perPage,
  page,
}: UseJobOrderListDataParams): UseJobOrderListDataResult {
  const filteredData = useMemo(() => {
    let next = data;

    if (activeTab === "Logistics") {
      next = next.filter((row) => row.service === "Logistics");
    }

    if (activeTab === "Regulatory") {
      next = next.filter((row) => row.service === "Regulatory");
    }

    if (search) {
      const lowered = search.toLowerCase();
      next = next.filter(
        (row) =>
          row.client.toLowerCase().includes(lowered) ||
          row.reference_number.toLowerCase().includes(lowered),
      );
    }

    if (tradeType) {
      next = next.filter(
        (row) => row.service === "Logistics" && row.trade_type === tradeType,
      );
    }

    if (status) {
      next = next.filter((row) => row.status === status);
    }

    if (personInCharge) {
      const lowered = personInCharge.toLowerCase();
      next = next.filter((row) =>
        row.person_in_charge?.name.toLowerCase().includes(lowered),
      );
    }

    return next;
  }, [activeTab, data, search, tradeType, status, personInCharge]);

  const pagedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage],
  );

  const counts = useMemo(() => {
    const all = data.length;
    const logisticsCount = data.filter(
      (row) => row.service === "Logistics",
    ).length;
    const regulatoryCount = data.filter(
      (row) => row.service === "Regulatory",
    ).length;
    return { all, Logistics: logisticsCount, Regulatory: regulatoryCount };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

  const pages = useMemo<Array<number | "...">>(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  return { filteredData, pagedData, counts, totalPages, pages };
}
