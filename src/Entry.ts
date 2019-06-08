import { isNotNull } from './Maybe';

export interface Entry {
  id: string;
  parentId: string | null;
}

export interface Table<E extends Entry> {
  childrenById: {
    [key: string]: string[];
  };
  entriesById: {
    [key: string]: E;
  };
}

export function insertEntries<E extends Entry>(table: Table<E>, entries: E[]): Table<E> {
  const childrenById: Table<E>['childrenById'] = { ...table.childrenById };
  const entriesById: Table<E>['entriesById'] = { ...table.entriesById };

  entries.forEach(entry => {
    if (isNotNull(entry.parentId)) {
      childrenById[entry.parentId] = [...(childrenById[entry.parentId] || []), entry.id];
    }
    childrenById[entry.id] = childrenById[entry.id] || [];
    entriesById[entry.id] = entry;
  });

  return { childrenById, entriesById };
}

export declare function deleteEntries<E extends Entry>(table: Table<E>, ids: string[]): Table<E>;
export declare function updateEntries<E extends Entry>(table: Table<E>, entries: E[]): Table<E>;
export declare function selectEntries<E extends Entry>(table: Table<E>, ids: string[]): E[];
