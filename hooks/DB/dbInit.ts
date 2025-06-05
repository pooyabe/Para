import Realm from "realm";

import {
    IncomeSchema,
    IncomeSourceSchema,
    IncomeStorageLocationSchema,
} from "./schemas/IncomeSchemas";
import {
    SpendingGoodSchema,
    SpendingImportanceSchema,
    SpendingSchema,
} from "./schemas/SpendingSchemas";

const databaseOptions = {
  path: "theLocalDb.realm",
  schema: [
    SpendingGoodSchema,
    SpendingImportanceSchema,
    SpendingSchema,
    IncomeSourceSchema,
    IncomeStorageLocationSchema,
    IncomeSchema,
  ],
  schemaVersion: 1,
};

let realmInstance: Realm | null = null;

export function getRealm() {
  if (realmInstance === null) {
    realmInstance = new Realm(databaseOptions);

    // درج دیتا پیش‌فرض برای importance
    realmInstance.write(() => {
      const existing = realmInstance.objects("SpendingImportance");
      if (existing.length === 0) {
        realmInstance.create("SpendingImportance", { id: 0, title: "الکی" });
        realmInstance.create("SpendingImportance", {
          id: 1,
          title: "میشد خرج نکرد",
        });
        realmInstance.create("SpendingImportance", { id: 2, title: "ضروری" });
      }
    });
  }
  return realmInstance;
}
