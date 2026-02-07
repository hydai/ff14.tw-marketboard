import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "@/components/layout/AppLayout";
import { OverviewPage } from "@/pages/OverviewPage";

const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const ItemDetailPage = lazy(() =>
  import("@/pages/ItemDetailPage").then((m) => ({ default: m.ItemDetailPage })),
);
const ArbitragePage = lazy(() =>
  import("@/pages/ArbitragePage").then((m) => ({ default: m.ArbitragePage })),
);
const DealsPage = lazy(() =>
  import("@/pages/DealsPage").then((m) => ({ default: m.DealsPage })),
);
const TrendingPage = lazy(() =>
  import("@/pages/TrendingPage").then((m) => ({ default: m.TrendingPage })),
);
const TaxRatesPage = lazy(() =>
  import("@/pages/TaxRatesPage").then((m) => ({ default: m.TaxRatesPage })),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="items/:itemId" element={<ItemDetailPage />} />
              <Route path="arbitrage" element={<ArbitragePage />} />
              <Route path="deals" element={<DealsPage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="tax-rates" element={<TaxRatesPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
