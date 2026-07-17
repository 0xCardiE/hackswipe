import Link from "next/link";
import {
  comparisonIntro,
  comparisonRows,
  competitors,
  costOverTime,
  type ComparisonCell,
  type TwoColumnComparisonRow,
} from "@/config/comparison";
import { product } from "@/config/product";

function renderCell(value: ComparisonCell) {
  if (value === true) {
    return <span className="font-semibold text-[var(--ok,#008a00)]">✓</span>;
  }
  if (value === false) {
    return <span className="text-[var(--muted)]">—</span>;
  }
  return <span>{value}</span>;
}

export type { TwoColumnComparisonRow };

type CompareTwoColumnTableProps = {
  competitorName: string;
  rows: readonly TwoColumnComparisonRow[];
  costOverTime?: readonly { period: string; hackSwipe: string; competitor: string }[];
  costFootnote?: string;
};

export function CompareTwoColumnTable({
  competitorName,
  rows,
  costOverTime: costRows,
  costFootnote,
}: CompareTwoColumnTableProps) {
  return (
    <div className="space-y-10">
      <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
        <table className="min-w-[520px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]">
              <th className="px-4 py-4 font-semibold text-[var(--text)]">Feature</th>
              <th className="px-4 py-4 font-semibold text-[var(--accent)]">{product.proName}</th>
              <th className="px-4 py-4 font-semibold text-[var(--text)]">{competitorName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.feature}
                className={`border-b border-[var(--surface-border)] last:border-b-0 ${
                  row.highlight ? "bg-[rgba(255,45,85,0.04)]" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 font-medium text-[var(--text)]">
                  {row.feature}
                </th>
                <td className="px-4 py-3 text-[var(--text)]">{renderCell(row.hackSwipe)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{renderCell(row.competitor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {costRows && costRows.length > 0 ? (
        <div>
          <h3 className="mb-4 text-lg font-semibold">What you pay over time</h3>
          <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
            <table className="min-w-[480px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]">
                  <th className="px-4 py-3 font-semibold">Period</th>
                  <th className="px-4 py-3 font-semibold text-[var(--accent)]">{product.name} Lifetime</th>
                  <th className="px-4 py-3 font-semibold">{competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row) => (
                  <tr key={row.period} className="border-b border-[var(--surface-border)] last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {row.period}
                    </th>
                    <td className="px-4 py-3 font-semibold text-[var(--accent)]">{row.hackSwipe}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {costFootnote ? <p className="mt-3 text-xs text-[var(--muted)]">{costFootnote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

type ComparisonTableProps = {
  showCostOverTime?: boolean;
  id?: string;
};

export function ComparisonTable({ showCostOverTime = false, id }: ComparisonTableProps) {
  return (
    <div id={id} className="space-y-10">
      <p className="max-w-3xl text-[var(--muted)] leading-relaxed">{comparisonIntro}</p>

      <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]">
              <th className="px-4 py-4 font-semibold text-[var(--text)]">Feature</th>
              <th className="px-4 py-4 font-semibold text-[var(--accent)]">{product.proName}</th>
              <th className="px-4 py-4 font-semibold text-[var(--text)]">
                <Link href={competitors.autoSwiper.comparePath} className="hover:text-[var(--accent)] hover:underline">
                  {competitors.autoSwiper.name}
                </Link>
              </th>
              <th className="px-4 py-4 font-semibold text-[var(--text)]">
                <Link
                  href={competitors.matchedAutoSwiper.comparePath}
                  className="hover:text-[var(--accent)] hover:underline"
                >
                  {competitors.matchedAutoSwiper.name}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr
                key={row.feature}
                className={`border-b border-[var(--surface-border)] last:border-b-0 ${
                  row.highlight ? "bg-[rgba(255,45,85,0.04)]" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 font-medium text-[var(--text)]">
                  {row.feature}
                </th>
                <td className="px-4 py-3 text-[var(--text)]">{renderCell(row.hackSwipe)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{renderCell(row.autoSwiper)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{renderCell(row.matchedAutoSwiper)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCostOverTime ? (
        <div>
          <h3 className="mb-4 text-lg font-semibold">What you pay over time</h3>
          <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
            <table className="min-w-[640px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]">
                  <th className="px-4 py-3 font-semibold">Period</th>
                  <th className="px-4 py-3 font-semibold text-[var(--accent)]">{product.name} Lifetime</th>
                  <th className="px-4 py-3 font-semibold">{competitors.autoSwiper.name}</th>
                  <th className="px-4 py-3 font-semibold">{competitors.matchedAutoSwiper.name}</th>
                </tr>
              </thead>
              <tbody>
                {costOverTime.map((row) => (
                  <tr key={row.period} className="border-b border-[var(--surface-border)] last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {row.period}
                    </th>
                    <td className="px-4 py-3 font-semibold text-[var(--accent)]">{row.hackSwipe}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{row.autoSwiper}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{row.matchedAutoSwiper}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Subscription totals assume Auto Swiper Pro billed yearly (~$36/year) and Matched Premium (~$5/month, ~$60/year).
            Actual spend depends on the plan you pick on their sites.
          </p>
        </div>
      ) : null}
    </div>
  );
}
