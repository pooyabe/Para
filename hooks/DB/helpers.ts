import Realm from "realm";

export function getNextId(realm: Realm, schemaName: string): number {
  const objects = realm.objects(schemaName);
  if (objects.length === 0) return 1;
  return (objects.max("id") as number) + 1;
}
