export const SpendingGoodSchema = {
  name: "SpendingGood",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
  },
};

export const SpendingImportanceSchema = {
  name: "SpendingImportance",
  primaryKey: "id",
  properties: {
    id: "int",
    title: "string",
  },
};

export const SpendingSchema = {
  name: "Spending",
  primaryKey: "id",
  properties: {
    id: "int",
    amount: "int",
    good: "SpendingGood",
    importance: "SpendingImportance",
    date: "date",
    create_datetime: "date",
  },
};
