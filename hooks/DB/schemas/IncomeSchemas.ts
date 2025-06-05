export const IncomeSourceSchema = {
  name: "IncomeSource",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
    create_datetime: "date",
  },
};

export const IncomeStorageLocationSchema = {
  name: "IncomeStorageLocation",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "IncomeSource",
    create_datetime: "date",
  },
};

export const IncomeSchema = {
  name: "Income",
  primaryKey: "id",
  properties: {
    id: "int",
    amount: "int",
    source: "IncomeSource",
    storage_location: "IncomeStorageLocation",
    date: "date",
    create_datetime: "date",
  },
};
