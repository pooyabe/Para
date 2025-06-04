import Realm from "realm";

// تعریف schemaها
const GoodSchema = {
  name: "Good",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
  },
};

const ImportanceSchema = {
  name: "Importance",
  primaryKey: "id",
  properties: {
    id: "int",
    title: "string",
  },
};

const SpendingSchema = {
  name: "Spending",
  primaryKey: "id",
  properties: {
    id: "int",
    amount: "int",
    good: "Good",
    importance: "Importance",
    date: "date",
    create_datetime: "date",
  },
};

const IncomeSchema = {
  name: "Income",
  primaryKey: "id",
  properties: {
    id: "int",
    amount: "int",
    date: "date",
    create_datetime: "date",
  },
};

const databaseOptions = {
  path: "theLocalDb.realm",
  schema: [GoodSchema, ImportanceSchema, SpendingSchema, IncomeSchema],
  schemaVersion: 1,
};

let realmInstance: Realm | null = null;

export function getRealm() {
  if (realmInstance === null) {
    realmInstance = new Realm(databaseOptions);

    // درج دیتا پیش‌فرض برای importance
    realmInstance.write(() => {
      const existing = realmInstance.objects("Importance");
      if (existing.length === 0) {
        realmInstance.create("Importance", { id: 0, title: "الکی" });
        realmInstance.create("Importance", { id: 1, title: "میشد خرج نکرد" });
        realmInstance.create("Importance", { id: 2, title: "ضروری" });
      }
    });
  }
  return realmInstance;
}

// Helper برای گرفتن id جدید
export function getNextId(realm: Realm, schemaName: string): number {
  const objects = realm.objects(schemaName);
  if (objects.length === 0) return 1;
  return (objects.max("id") as number) + 1;
}

// توابع CRUD نمونه

// اضافه کردن کالای جدید
export function addGood(name: string) {
  const realm = getRealm();
  realm.write(() => {
    realm.create("Good", {
      id: getNextId(realm, "Good"),
      name,
    });
  });
}

// گرفتن همه کالاها
export function getAllGoods() {
  const realm = getRealm();
  return realm.objects("Good");
}

// اضافه کردن هزینه جدید
export function addSpending(
  amount: number,
  goodId: number,
  importanceId: number,
  date: Date
) {
  const realm = getRealm();
  const good = realm.objectForPrimaryKey("Good", goodId);
  const importance = realm.objectForPrimaryKey("Importance", importanceId);

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

// اضافه کردن درآمد
export function addIncome(amount: number, date: Date) {
  const realm = getRealm();
  realm.write(() => {
    realm.create("Income", {
      id: getNextId(realm, "Income"),
      amount,
      date,
      create_datetime: new Date(),
    });
  });
}

// گرفتن همه درآمدها
export function getAllIncomes() {
  const realm = getRealm();
  return realm.objects("Income").sorted("date", true);
}
