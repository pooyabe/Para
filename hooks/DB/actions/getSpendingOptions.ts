import { getDbConnection } from "../helpers";
import { excludeLoanReasons } from "./loanQueries";

type OptionItem = {
  label: string;
  value: string;
};

type SpendingOptionsConfig = {
  /**
   * دلیل‌های خودکار وام‌ها در فهرست دلیل فرم هزینه جدید نمایش داده نمی‌شوند.
   * پیش‌فرض (مثلاً در ویرایش تراکنش) همه موارد است.
   */
  hideLoanReasons?: boolean;
};

export async function getSpendingOptions({
  hideLoanReasons = false,
}: SpendingOptionsConfig = {}): Promise<OptionItem[]> {
  const db = await getDbConnection();

  const rows = await db.getAllAsync<{ id: number; title: string }>(
    `SELECT id, title FROM spending_items ORDER BY title ASC`
  );

  const visibleRows = hideLoanReasons
    ? excludeLoanReasons(rows, "payable")
    : rows;

  return visibleRows.map((row) => ({
    label: row.title,
    value: row.title,
  }));
}
