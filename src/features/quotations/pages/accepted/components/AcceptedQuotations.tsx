import { AcceptedQuotationsClientTabs } from "./AcceptedQuotationsClientTabs";
import { AcceptedQuotationsFilters } from "./AcceptedQuotationsFilters";
import {
  AcceptedQuotationsLayout,
  AcceptedQuotationsPage,
  AcceptedQuotationsPanel,
} from "./AcceptedQuotationsLayout";
import { AcceptedQuotationsProvider } from "./AcceptedQuotationsProvider";
import { AcceptedQuotationsTables } from "./AcceptedQuotationsTables";

export const AcceptedQuotations = {
  Provider: AcceptedQuotationsProvider,
  Page: AcceptedQuotationsPage,
  Layout: AcceptedQuotationsLayout,
  ClientTabs: AcceptedQuotationsClientTabs,
  Panel: AcceptedQuotationsPanel,
  Filters: AcceptedQuotationsFilters,
  Tables: AcceptedQuotationsTables,
};
