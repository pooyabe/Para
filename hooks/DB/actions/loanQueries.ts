import { getDbConnection } from "../helpers";
import { addLoanPayment } from "./addLoanPayment";
import type { Loan } from "./getLoans";

/**
 * قالب عنوان دلیل‌هایی که برای تراکنش‌های وام ساخته می‌شود.
 * عنوان دلیل فقط شامل منبع وام است، پس فیلتر کردن دلیل‌های وام‌های
 * تسویه‌شده بر اساس همین قالب و منبع وام‌های باز انجام می‌شود.
 */
export const PAYABLE_LOAN_REASON_PREFIX = "پرداخت وام: ";
export const RECEIVABLE_LOAN_REASON_PREFIX = "دریافت وام: ";

const LOAN_REASON_PREFIX: Record<"payable" | "receivable", string> = {
  payable: PAYABLE_LOAN_REASON_PREFIX,
  receivable: RECEIVABLE_LOAN_REASON_PREFIX,
};

/** Get loan by id - static query module (no circular deps) */
export async function getLoanById(id: number): Promise<Loan | null> {
  const db = await getDbConnection();

  const result = await db.getFirstAsync<Loan>(
    `SELECT * FROM loans WHERE id = ?`,
    [id]
  );

  return result || null;
}

/**
 * حذف دلیل‌های مربوط به وام‌های تسویه‌شده از یک فهرست دلیل.
 *
 * رکوردهای `spending_items` و `income_reasons` دست‌نخورده می‌مانند (تراکنش‌های
 * قبلی به آن‌ها وصل‌اند)؛ فقط از فهرست انتخاب دلیل کنار گذاشته می‌شوند.
 */
export async function excludeSettledLoanReasons<T extends { title: string }>(
  rows: T[],
  loanType: "payable" | "receivable"
): Promise<T[]> {
  const prefix = LOAN_REASON_PREFIX[loanType];

  if (!rows.some((row) => row.title.startsWith(prefix))) return rows;

  const db = await getDbConnection();

  const openLoans = await db.getAllAsync<{ source: string }>(
    `SELECT source FROM loans WHERE type = ? AND is_settled = 0`,
    [loanType]
  );

  const openTitles = new Set(openLoans.map((loan) => `${prefix}${loan.source}`));

  return rows.filter(
    (row) => !row.title.startsWith(prefix) || openTitles.has(row.title)
  );
}

export { addLoanPayment };
