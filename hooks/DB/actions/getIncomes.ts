// hooks/DB/actions/getIncomes.ts
import { getDbConnection } from "../helpers";

export async function getIncomes(): Promise<
  {
    id: number;
    amount: number;
    reason: string;
    destination: string;
    transaction_date: string;
    create_date: string;
  }[]
> {
  const db = await getDbConnection();

  const results = await db.getAllAsync(`
    SELECT
      incomes.id,
      incomes.amount,
      incomes.transaction_date,
      incomes.create_date,
      income_reasons.title AS reason,
      income_destinations.title AS destination
    FROM incomes
    LEFT JOIN income_reasons ON incomes.reason_id = income_reasons.id
    LEFT JOIN income_destinations ON incomes.destination_id = income_destinations.id
    ORDER BY incomes.transaction_date DESC;
  `);

  return results;
}
