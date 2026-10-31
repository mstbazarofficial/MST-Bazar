import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINANCE_COLORS } from "@/lib/analytics/chart-colors";
import { formatPrice } from "@/utils/format-price";

export function ExpenseCategoryCard({
  categories,
}: {
  categories: { category: string; label: string; amount: number }[];
}) {
  const total = categories.reduce((sum, { amount }) => sum + amount, 0);

  return (
    <Card className="h-full border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Expenses by category
        </CardTitle>
        <p className="text-sm text-muted-foreground">For this period</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expenses in this period.
          </p>
        )}

        {categories.map(({ category, label, amount }) => {
          const share = total > 0 ? (amount / total) * 100 : 0;

          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate text-foreground">{label}</span>
                <span className="shrink-0 font-medium text-foreground">
                  {formatPrice(amount)}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    {share.toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${share}%`,
                    backgroundColor: FINANCE_COLORS.expenses,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
