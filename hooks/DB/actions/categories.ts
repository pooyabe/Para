import { getDbConnection } from "../helpers";

/**
 * دسته‌بندی‌های قابل ویرایش برنامه:
 * - spending: دسته‌های هزینه (جدول spending_items)
 * - incomeReason: دلیل‌های درآمد (جدول income_reasons)
 * - incomeDestination: محل‌های درآمد (جدول income_destinations)
 */
export type CategoryKind = "spending" | "incomeReason" | "incomeDestination";

export type CategoryItem = {
  id: number;
  title: string;
  /** تعداد تراکنش‌هایی که به این مورد وصل‌اند. */
  transactionCount: number;
  /** از تراکنش‌های بالا، چند مورد به یک وام وصل‌اند. */
  loanTransactionCount: number;
};

export type CategoryError =
  | "invalid-title"
  | "duplicate-title"
  | "not-found"
  | "invalid-target"
  | "failed";

export type CategoryResult =
  | { success: true }
  | { success: false; error: CategoryError };

type CategorySource = {
  itemTable: "spending_items" | "income_reasons" | "income_destinations";
  transactionTable: "spendings" | "incomes";
  foreignKey: "item_id" | "reason_id" | "destination_id";
  /** نوع رکورد وام متناظر با این تراکنش‌ها در loan_payments */
  loanPaymentType: "payment" | "receipt";
};

// نام جدول‌ها ثابت است و از ورودی کاربر ساخته نمی‌شود.
const CATEGORY_SOURCES: Record<CategoryKind, CategorySource> = {
  spending: {
    itemTable: "spending_items",
    transactionTable: "spendings",
    foreignKey: "item_id",
    loanPaymentType: "payment",
  },
  incomeReason: {
    itemTable: "income_reasons",
    transactionTable: "incomes",
    foreignKey: "reason_id",
    loanPaymentType: "receipt",
  },
  incomeDestination: {
    itemTable: "income_destinations",
    transactionTable: "incomes",
    foreignKey: "destination_id",
    loanPaymentType: "receipt",
  },
};

const MAX_TITLE_LENGTH = 60;

type Db = Awaited<ReturnType<typeof getDbConnection>>;

/** فهرست موارد یک دسته‌بندی همراه با تعداد تراکنش هرکدام. */
export async function getCategoryItems(
  kind: CategoryKind,
): Promise<CategoryItem[]> {
  const db = await getDbConnection();
  const { itemTable, transactionTable, foreignKey } = CATEGORY_SOURCES[kind];

  const rows = await db.getAllAsync<{
    id: number;
    title: string;
    transactionCount: number;
    loanTransactionCount: number;
  }>(
    `SELECT ci.id AS id, ci.title AS title, COUNT(t.id) AS transactionCount,
            COALESCE(SUM(CASE WHEN t.loan_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS loanTransactionCount
     FROM ${itemTable} ci
     LEFT JOIN ${transactionTable} t ON t.${foreignKey} = ci.id
     GROUP BY ci.id, ci.title
     ORDER BY ci.title ASC`,
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    transactionCount: Number(row.transactionCount),
    loanTransactionCount: Number(row.loanTransactionCount),
  }));
}

/**
 * تغییر نام یک مورد.
 *
 * تراکنش‌ها به id مورد وصل‌اند، پس تغییر نام روی همه آن‌ها اثر می‌گذارد و
 * لازم نیست چیزی در تراکنش‌ها دست‌کاری شود.
 */
export async function renameCategoryItem(
  kind: CategoryKind,
  id: number,
  title: string,
): Promise<CategoryResult> {
  const nextTitle = title.trim().replace(/\s+/g, " ");

  if (!nextTitle || nextTitle.length > MAX_TITLE_LENGTH) {
    return { success: false, error: "invalid-title" };
  }

  const db = await getDbConnection();
  const { itemTable } = CATEGORY_SOURCES[kind];

  try {
    const item = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${itemTable} WHERE id = ?`,
      [id],
    );

    if (!item) return { success: false, error: "not-found" };

    const duplicate = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${itemTable} WHERE title = ? AND id <> ?`,
      [nextTitle, id],
    );

    if (duplicate) return { success: false, error: "duplicate-title" };

    await db.runAsync(`UPDATE ${itemTable} SET title = ? WHERE id = ?`, [
      nextTitle,
      id,
    ]);

    return { success: true };
  } catch (error) {
    console.error("[Categories] ❌ rename failed:", error);
    return { success: false, error: "failed" };
  }
}

/**
 * تراکنشی که به یک وام وصل است، یک رکورد در loan_payments هم دارد؛ حذف
 * تراکنش باید آن رکورد، مبلغ پرداخت‌شده و وضعیت تسویه وام را هم اصلاح کند.
 */
async function removeLoanLinkForTransaction(
  db: Db,
  loanPaymentType: "payment" | "receipt",
  loanId: number,
  amount: number,
  transactionDate: string,
): Promise<void> {
  const loanPayment = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM loan_payments
     WHERE loan_id = ? AND amount = ? AND payment_date = ? AND type = ?
     LIMIT 1`,
    [loanId, amount, transactionDate, loanPaymentType],
  );

  if (!loanPayment) return;

  await db.runAsync(`DELETE FROM loan_payments WHERE id = ?`, [loanPayment.id]);

  await db.runAsync(
    `UPDATE loans SET paid_amount = MAX(0, paid_amount - ?) WHERE id = ?`,
    [amount, loanId],
  );

  await db.runAsync(
    `UPDATE loans
     SET is_settled = CASE WHEN paid_amount >= amount THEN 1 ELSE 0 END
     WHERE id = ?`,
    [loanId],
  );
}

/**
 * حذف یک مورد همراه با همه تراکنش‌هایش.
 * همه تغییرات در یک تراکنش دیتابیس انجام می‌شود تا نیمه‌کاره نماند.
 */
export async function deleteCategoryItem(
  kind: CategoryKind,
  id: number,
): Promise<CategoryResult> {
  const db = await getDbConnection();
  const { itemTable, transactionTable, foreignKey, loanPaymentType } =
    CATEGORY_SOURCES[kind];

  try {
    const item = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${itemTable} WHERE id = ?`,
      [id],
    );

    if (!item) return { success: false, error: "not-found" };

    await db.withTransactionAsync(async () => {
      const transactions = await db.getAllAsync<{
        id: number;
        loan_id: number | null;
        amount: number;
        transaction_date: string;
      }>(
        `SELECT id, loan_id, amount, transaction_date
         FROM ${transactionTable}
         WHERE ${foreignKey} = ?`,
        [id],
      );

      for (const transaction of transactions) {
        if (transaction.loan_id) {
          await removeLoanLinkForTransaction(
            db,
            loanPaymentType,
            transaction.loan_id,
            transaction.amount,
            transaction.transaction_date,
          );
        }
      }

      await db.runAsync(
        `DELETE FROM ${transactionTable} WHERE ${foreignKey} = ?`,
        [id],
      );
      await db.runAsync(`DELETE FROM ${itemTable} WHERE id = ?`, [id]);
    });

    return { success: true };
  } catch (error) {
    console.error("[Categories] ❌ delete failed:", error);
    return { success: false, error: "failed" };
  }
}

/**
 * انتقال همه تراکنش‌های یک مورد به مورد دیگر و سپس حذف مورد اول.
 */
export async function moveCategoryTransactions(
  kind: CategoryKind,
  sourceId: number,
  targetId: number,
): Promise<CategoryResult> {
  if (sourceId === targetId) {
    return { success: false, error: "invalid-target" };
  }

  const db = await getDbConnection();
  const { itemTable, transactionTable, foreignKey } = CATEGORY_SOURCES[kind];

  try {
    const source = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${itemTable} WHERE id = ?`,
      [sourceId],
    );
    const target = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${itemTable} WHERE id = ?`,
      [targetId],
    );

    if (!source || !target) return { success: false, error: "invalid-target" };

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE ${transactionTable} SET ${foreignKey} = ? WHERE ${foreignKey} = ?`,
        [targetId, sourceId],
      );
      await db.runAsync(`DELETE FROM ${itemTable} WHERE id = ?`, [sourceId]);
    });

    return { success: true };
  } catch (error) {
    console.error("[Categories] ❌ move failed:", error);
    return { success: false, error: "failed" };
  }
}
