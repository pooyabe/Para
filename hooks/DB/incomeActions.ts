import { getRealm } from "./dbInit";
import { getNextId } from "./helpers";

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
