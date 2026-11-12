import { getDbConnection } from "../helpers";
import { excludeSettledLoanReasons } from "./loanQueries";

type OptionItem = {
  label: string;
  value: string;
};

type SpendingOptionsConfig = {
  /**
   * دلیل‌های ساخته‌شده برای وام‌های تسویه‌شده در فهرست دلیل فرم هزینه جدید
   * نمایش داده نمی‌شوند. پیش‌فرض (مثلاً در ویرایش تراکنش) همه موارد است.
   */
  hideSettledLoanReasons?: boolean;
};

export async function getSpendingOptions({
  hideSettledLoanReasons = false,
}: SpendingOptionsConfig = {}): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ id: number; title: string }>(
    `SELECT id, title FROM spending_items ORDER BY title ASC`
  );

  const visibleRows = hideSettledLoanReasons
    ? await excludeSettledLoanReasons(rows, "payable")
    : rows;

  return visibleRows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}
