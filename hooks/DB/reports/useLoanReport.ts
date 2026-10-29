import {
  CustomRange,
  getDateRange,
  RangeType,
} from "@/hooks/BackEnd/useDateRange";
import { useShamsiDate } from "@/hooks/BackEnd/useShamsiDate";
import { getDbConnection } from "../helpers";

export type LoanReportData = {
  receivableTotal: number;
  receivableOutstanding: number;
  payableTotal: number;
  payableOutstanding: number;
  receivedInRange: number;
  paidInRange: number;
  loanCountInRange: number;
};

export async function getLoanReport(
  rangeKey: RangeType,
  customRange?: CustomRange,
): Promise<LoanReportData> {
  const db = await getDbConnection();
  const { toGregorian } = useShamsiDate();
  const { startDate, endDate } = await getDateRange(rangeKey, customRange);
  const start = toGregorian(startDate);
  const end = toGregorian(endDate);

  const totals = await db.getFirstAsync<{
    receivableTotal: number;
    receivableOutstanding: number;
    payableTotal: number;
    payableOutstanding: number;
  }>(
    `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'receivable' THEN amount ELSE 0 END), 0) as receivableTotal,
        COALESCE(SUM(CASE WHEN type = 'receivable' THEN MAX(amount - COALESCE(paid_amount, 0), 0) ELSE 0 END), 0) as receivableOutstanding,
        COALESCE(SUM(CASE WHEN type = 'payable' THEN amount ELSE 0 END), 0) as payableTotal,
        COALESCE(SUM(CASE WHEN type = 'payable' THEN MAX(amount - COALESCE(paid_amount, 0), 0) ELSE 0 END), 0) as payableOutstanding
      FROM loans
    `,
  );

  const activity = await db.getFirstAsync<{
    receivedInRange: number;
    paidInRange: number;
  }>(
    `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'receipt' THEN amount ELSE 0 END), 0) as receivedInRange,
        COALESCE(SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END), 0) as paidInRange
      FROM loan_payments
      WHERE payment_date BETWEEN ? AND ?
    `,
    [start, end],
  );

  const newLoans = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM loans WHERE start_date BETWEEN ? AND ?`,
    [start, end],
  );

  return {
    receivableTotal: totals?.receivableTotal ?? 0,
    receivableOutstanding: totals?.receivableOutstanding ?? 0,
    payableTotal: totals?.payableTotal ?? 0,
    payableOutstanding: totals?.payableOutstanding ?? 0,
    receivedInRange: activity?.receivedInRange ?? 0,
    paidInRange: activity?.paidInRange ?? 0,
    loanCountInRange: newLoans?.count ?? 0,
  };
}
