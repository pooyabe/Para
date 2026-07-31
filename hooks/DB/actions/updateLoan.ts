import { getDbConnection } from "../helpers";

type UpdateLoanInput = {
  id: number;
  type?: "receivable" | "payable";
  amount?: number;
  paid_amount?: number;
  source?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  is_settled?: 0 | 1;
};

export async function updateLoan({
  id,
  type,
  amount,
  paid_amount,
  source,
  description,
  startDate,
  endDate,
  is_settled,
}: UpdateLoanInput): Promise<void> {
  const db = await getDbConnection();

  const updates: string[] = [];
  const params: any[] = [];

  if (type !== undefined) {
    updates.push("type = ?");
    params.push(type);
  }
  if (amount !== undefined) {
    updates.push("amount = ?");
    params.push(amount);
  }
  if (paid_amount !== undefined) {
    updates.push("paid_amount = ?");
    params.push(paid_amount);
  }
  if (source !== undefined) {
    updates.push("source = ?");
    params.push(source);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    params.push(description);
  }
  if (startDate !== undefined) {
    updates.push("start_date = ?");
    params.push(startDate);
  }
  if (endDate !== undefined) {
    updates.push("end_date = ?");
    params.push(endDate);
  }
  if (is_settled !== undefined) {
    updates.push("is_settled = ?");
    params.push(is_settled);
  }

  if (updates.length === 0) return;

  params.push(id);

  await db.runAsync(
    `UPDATE loans SET ${updates.join(", ")} WHERE id = ?`,
    params
  );
}