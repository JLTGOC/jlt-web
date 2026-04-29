import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

interface UseQuotationTableSearchOptions {
  debounceMs?: number;
  initialPerPage?: number;
}

export function useQuotationTableSearch(
  options: UseQuotationTableSearchOptions = {},
) {
  const { debounceMs = 400, initialPerPage = 10 } = options;

  const [search, setSearch] = useState("");
  const [immediateQuery, setImmediateQuery] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(search, debounceMs);
  const [secondarySearch, setSecondarySearch] = useState("");
  const [immediateSecondaryQuery, setImmediateSecondaryQuery] = useState<
    string | null
  >(null);
  const [debouncedSecondarySearch] = useDebouncedValue(
    secondarySearch,
    debounceMs,
  );
  const [perPage, setPerPage] = useState(initialPerPage);
  const [perPaginationPage, setPerPaginationPage] = useState(1);
  const searchQuery = immediateQuery ?? debouncedSearch.trim();
  const secondarySearchQuery =
    immediateSecondaryQuery ?? debouncedSecondarySearch.trim();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setImmediateQuery(null);
    if (!value.trim()) {
      setImmediateQuery("");
    }
  };

  const handleSearch = (value: string) => {
    const nextValue = value.trim();
    setSearch(nextValue);
    setImmediateQuery(nextValue);
  };

  const handleSecondarySearchChange = (value: string) => {
    setSecondarySearch(value);
    setImmediateSecondaryQuery(null);
    if (!value.trim()) {
      setImmediateSecondaryQuery("");
    }
  };

  const handleSecondarySearch = (value: string) => {
    const nextValue = value.trim();
    setSecondarySearch(nextValue);
    setImmediateSecondaryQuery(nextValue);
  };

  return {
    search,
    searchQuery,
    secondarySearch,
    secondarySearchQuery,
    perPage,
    setPerPage,
    perPaginationPage,
    setPerPaginationPage,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
  };
}
