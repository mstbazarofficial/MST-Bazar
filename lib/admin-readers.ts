import "server-only";

import { getAdminBannerById, getAdminBanners } from "@/actions/admin/banner-actions";
import {
  getAdminCategories,
  getAdminCategoryById,
} from "@/actions/admin/category-actions";
import { getAdminContacts } from "@/actions/admin/contact-actions";
import { getDashboardOverview } from "@/actions/admin/dashboard-actions";
import { getExpenses, getFinanceOverview } from "@/actions/admin/finance-actions";
import {
  getAdminOrderDetail,
  getAdminOrders,
  getAdminOrderStats,
} from "@/actions/admin/order-actions";
import {
  getAdminProductBySlug,
  getAdminProductOrders,
  getAdminProducts,
  getAdminProductStats,
  type ProductAvailabilityFilter,
} from "@/actions/admin/product-actions";
import {
  getAdminPromoCodeById,
  getAdminPromoCodes,
} from "@/actions/admin/promo-code-actions";
import { getAdminUserDetail, getAdminUsers } from "@/actions/admin/user-actions";
import {
  getAnalyticsDashboard,
  refreshAnalyticsDashboard,
} from "@/lib/analytics/actions";
import type { RangeKey } from "@/lib/analytics/types";

type Query = URLSearchParams;

const text = (query: Query, key: string) => query.get(key) ?? undefined;
const page = (query: Query) => Number(query.get("page")) || 1;
const required = (query: Query, key: string) => query.get(key) ?? "";

const financePeriod = (query: Query) => ({
  period: text(query, "period"),
  month: text(query, "month"),
  year: text(query, "year"),
  from: text(query, "from"),
  to: text(query, "to"),
});

/**
 * Admin reads served over GET. Server Actions run one at a time per client, so
 * fetching through them would queue a page's reads behind each other and behind
 * saves. Each reader keeps its own role check.
 */
export const adminReaders = {
  dashboard: () => getDashboardOverview(),

  orders: (query: Query) =>
    getAdminOrders({
      search: text(query, "search"),
      status: text(query, "status"),
      month: text(query, "month"),
      page: page(query),
    }),
  orderStats: () => getAdminOrderStats(),
  order: (query: Query) => getAdminOrderDetail(required(query, "orderId")),

  products: (query: Query) =>
    getAdminProducts({
      search: text(query, "search"),
      categorySlug: text(query, "categorySlug"),
      availability: (query.get("availability") ??
        "all") as ProductAvailabilityFilter,
      page: page(query),
    }),
  productStats: () => getAdminProductStats(),
  product: (query: Query) => getAdminProductBySlug(required(query, "slug")),
  productOrders: (query: Query) =>
    getAdminProductOrders(required(query, "productId")),

  categories: () => getAdminCategories(),
  category: (query: Query) => getAdminCategoryById(required(query, "id")),

  banners: () => getAdminBanners(),
  banner: (query: Query) => getAdminBannerById(required(query, "id")),

  promoCodes: () => getAdminPromoCodes(),
  promoCode: (query: Query) => getAdminPromoCodeById(required(query, "id")),

  contacts: (query: Query) =>
    getAdminContacts({
      search: text(query, "search"),
      status: text(query, "status"),
      month: text(query, "month"),
      page: page(query),
    }),

  users: (query: Query) =>
    getAdminUsers({
      search: text(query, "search"),
      role: text(query, "role"),
      month: text(query, "month"),
      page: page(query),
    }),
  user: (query: Query) => getAdminUserDetail(required(query, "id")),

  financeOverview: (query: Query) => getFinanceOverview(financePeriod(query)),
  expenses: (query: Query) =>
    getExpenses({
      ...financePeriod(query),
      search: text(query, "search"),
      category: text(query, "category"),
      page: page(query),
    }),

  analytics: (query: Query) => {
    const rangeKey = (query.get("range") ?? "30d") as RangeKey;
    const startDate = query.get("startDate");
    const endDate = query.get("endDate");
    const custom = startDate && endDate ? { startDate, endDate } : undefined;

    return query.get("refresh")
      ? refreshAnalyticsDashboard(rangeKey, custom)
      : getAnalyticsDashboard(rangeKey, custom);
  },
};

export type AdminReaders = typeof adminReaders;
