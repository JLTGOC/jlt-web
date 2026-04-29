import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { GuestRoute } from "@/components/guards/GuestRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { lazy } from "react";
import NotFound from "./routes/NotFound";
import { Loader } from "@mantine/core";

//auth import
const LoginPage = lazy(() => import("./routes/auth/LoginPage"));

//dashboard import
const DashboardPage = lazy(
  () => import("./routes/app/dashboard/DashboardPage"),
);

//account settings import
const AccountSettings = lazy(
  () => import("./routes/app/account-settings/AccountSettingsPage"),
);

//Quotation imports
const Quotations = lazy(() => import("./routes/app/quotations/QuotationsPage"));
const QuotationViewerPage = lazy(
  () => import("./routes/app/quotations/QuotationViewerPage"),
);

//Shipment Imports
const Shipments = lazy(() => import("./routes/app/shipments/ShipmentsPage"));
const ShipmentDetailsPage = lazy(() =>
  import("@/features/shipments/pages/ShipmentDetails").then((m) => ({
    default: m.ShipmentDetailsPage,
  })),
);

//Tool imports
const Tools = lazy(() => import("./routes/app/tools/ToolsPage"));

export const router = createBrowserRouter([
  // ==========================================
  // GUEST ROUTES
  // ==========================================
  {
    Component: GuestRoute,
    HydrateFallback: Loader,
    children: [{ path: "/login", Component: LoginPage }],
  },

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, Component: DashboardPage },

          //Account Settings routes
          { path: "account-settings", Component: AccountSettings },

          // Quotation routes — most specific first
          {
            path: "quotations/:tab/client/:clientId/:quotationId/documents",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/:quotationId/documents",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/view/:issuedQuotationId",
            Component: QuotationViewerPage,
          },
          {
            path: "quotations/:tab/:quotationId/view/:issuedQuotationId",
            Component: QuotationViewerPage,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/view",
            Component: QuotationViewerPage,
          },
          {
            path: "quotations/:tab/:quotationId/view",
            Component: QuotationViewerPage,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/compose/:template",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId/compose",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/:quotationId/compose/:template",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/:quotationId/compose",
            Component: Quotations,
          },
          {
            path: "quotations/:tab/client/:clientId/:quotationId",
            Component: Quotations,
          },
          { path: "quotations/:tab/:quotationId", Component: Quotations },
          { path: "quotations/:tab/client/:clientId", Component: Quotations },
          { path: "quotations/:tab", Component: Quotations },

          // Shipment routes — most specific first
          {
            path: "shipments/:tab/client/:clientId/:shipmentId/documents",
            Component: ShipmentDetailsPage,
          },
          {
            path: "shipments/:tab/client/:clientId/:shipmentId/compose",
            Component: ShipmentDetailsPage,
          },
          {
            path: "shipments/:tab/client/:clientId/:shipmentId",
            Component: ShipmentDetailsPage,
          },
          { path: "shipments/:category/:subCategory", Component: Shipments },
          { path: "shipments/:category", Component: Shipments },
          { path: "shipments", Component: Shipments },

          // ── Tools routes ──
          { path: "tools/templates/config/billing", Component: Tools },
          { path: "tools/templates/config/details", Component: Tools },
          {
            path: "tools/templates/config/standard-quotation-template",
            Component: Tools,
          },
          {
            path: "tools/templates/config/standard-quotation-template/new",
            Component: Tools,
          },
          {
            path: "tools/templates/config/standard-quotation-template/:templateId/edit",
            Component: Tools,
          },
          { path: "tools/services/:serviceType", Component: Tools },
          { path: "tools/services", Component: Tools },
          { path: "tools/messages", Component: Tools },
          { path: "tools/templates/new", Component: Tools },
          { path: "tools/templates/:templateId/edit", Component: Tools },
          { path: "tools/templates", Component: Tools },
          { path: "tools", Component: Tools },

          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
]);
