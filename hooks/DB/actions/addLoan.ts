import { getDbConnection } from "../helpers";

type AddLoanInput = {
  type: "receivable" | "payable";
  amount: number;
  source: string;
  description?: string;
  startDate: string;
  endDate: string;
};

export async function addLoan({
  type,
  amount,
  source,
  description,
  startDate,
  endDate,
}: AddLoanInput): Promise<void> {
  const db = await getDbConnection();

  await db.runAsync(
    `INSERT INTO loans (type, amount, paid_amount, source, description, start_date, end_date, is_settled)
     VALUES (?, ?, 0, ?, ?, ?, ?, 0)`,
    [type, amount, source, description || "", startDate, endDate]
  );
}