import { flatten, uniq } from 'lodash';
import { isNotNull, isNotUndefined, isUndefined } from './Maybe';

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

export function selectEntries<E extends Entry>(table: Table<E>, ids: string[]): E[] {
  return ids.map(id => table.entriesById[id]).filter(isNotUndefined);
}

export function updateEntries<E extends Entry>(table: Table<E>, entries: E[]): Table<E> {
  const childrenById: Table<E>['childrenById'] = { ...table.childrenById };
  const entriesById: Table<E>['entriesById'] = { ...table.entriesById };

  entries.forEach(entry => {
    const oldEntry = entriesById[entry.id];
    if (isUndefined(oldEntry)) {
      return;
    }

    entriesById[entry.id] = entry;

    if (entry.parentId === oldEntry.parentId) {
      return;
    }

    if (isNotNull(entry.parentId)) {
      childrenById[entry.parentId] = [...(childrenById[entry.parentId] || []), entry.id];
    }
    if (isNotNull(oldEntry.parentId)) {
      childrenById[oldEntry.parentId] = (childrenById[oldEntry.parentId] || []).filter(
        id => id !== oldEntry.id,
      );
    }
  });

  return { childrenById, entriesById };
}

export function deleteEntries<E extends Entry>(table: Table<E>, ids: string[]): Table<E> {
  // Delete children first
  const deletingIds = uniq(flatten(ids.map(id => table.childrenById[id]).filter(isNotUndefined)));
  const newTable = deletingIds.length ? deleteEntries(table, deletingIds) : table;

  const childrenById: Table<E>['childrenById'] = { ...newTable.childrenById };
  const entriesById: Table<E>['entriesById'] = { ...newTable.entriesById };

  const entries = selectEntries(newTable, ids);
  entries.forEach(entry => {
    if (isNotNull(entry.parentId)) {
      childrenById[entry.parentId] = (childrenById[entry.parentId] || []).filter(
        id => id !== entry.id,
      );
    }
    delete childrenById[entry.id];
    delete entriesById[entry.id];
  });

  return { childrenById, entriesById };
}
