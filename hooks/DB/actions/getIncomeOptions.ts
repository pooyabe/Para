import { getDbConnection } from "../helpers";
import { excludeSettledLoanReasons } from "./loanQueries";

type OptionItem = {
  label: string;
  value: string;
};

type IncomeReasonsConfig = {
  /**
   * دلیل‌های ساخته‌شده برای وام‌های تسویه‌شده در فهرست دلیل فرم درآمد جدید
   * نمایش داده نمی‌شوند. پیش‌فرض (مثلاً در ویرایش تراکنش) همه موارد است.
   */
  hideSettledLoanReasons?: boolean;
};

export async function getIncomeReasons({
  hideSettledLoanReasons = false,
}: IncomeReasonsConfig = {}): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ id: number; title: string }>(
    `SELECT id, title FROM income_reasons ORDER BY title ASC`
  );

  const visibleRows = hideSettledLoanReasons
    ? await excludeSettledLoanReasons(rows, "receivable")
    : rows;

  return visibleRows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}

export async function getIncomeDestinations(): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ title: string }>(
    `SELECT id, title FROM income_destinations ORDER BY title ASC`
  );

  return rows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}
