import { getRealm } from "./dbInit";
import { getNextId } from "./helpers";

// اضافه کردن کالای جدید
export function findOrCreateGood(name: string): number {
  const realm = getRealm();
  const existing = realm
    .objects("SpendingGood")
    .filtered("name == $0", name)[0];

  if (existing) {
    return existing.id;
  } else {
    const id = getNextId(realm, "SpendingGood");
    realm.write(() => {
      realm.create("SpendingGood", {
        id,
        name,
      });
    });
    return id;
  }
}

// گرفتن همه کالاها
export function getAllGoods() {
  const realm = getRealm();
  return realm.objects("SpendingGood");
}

// اضافه کردن هزینه جدید
export function addSpending(
  amount: number,
  goodId: number,
  importanceId: number,
  date: Date
) {
  const realm = getRealm();
  const good = realm.objectForPrimaryKey("SpendingGood", goodId);
  const importance = realm.objectForPrimaryKey(
    "SpendingImportance",
    importanceId
  );

  if (!good || !importance) throw new Error("Good یا Importance یافت نشد");

  realm.write(() => {
    realm.create("Spending", {
      id: getNextId(realm, "Spending"),
      amount,
      good,
      importance,
      date,
      create_datetime: new Date(),
    });
  });
}

// گرفتن همه هزینه‌ها
export function getAllSpendings() {
  const realm = getRealm();
  return realm.objects("Spending").sorted("date", true); // نزولی
}
