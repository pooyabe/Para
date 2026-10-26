import { useEffect, useState } from "react";

/**
 * A tiny app-wide counter that is bumped whenever the database content is
 * replaced (a restore or a wipe from the settings page).
 *
 * Tab screens stay mounted while you switch tabs, so without this they would
 * keep showing the data they loaded before the restore.
 */
let dataRevision = 0;

const listeners = new Set<(revision: number) => void>();

export const bumpDataRevision = () => {
  dataRevision += 1;
  listeners.forEach((listener) => listener(dataRevision));
};

const subscribe = (listener: (revision: number) => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

/** Re-renders the caller every time the stored data is replaced. */
export function useDataRevision() {
  const [revision, setRevision] = useState(dataRevision);

  useEffect(() => subscribe(setRevision), []);

  return revision;
}
