import { Entry, Table } from './Entry';
import { isNotUndefined } from './Maybe';

export interface DenormalizedEntry<E extends Entry> extends Entry {
  children: DenormalizedEntry<E>[];
}

export function denormalizeEntry<E extends Entry>(
  table: Table<E>,
  id: string,
): DenormalizedEntry<E> {
  const entry: E = table.entriesById[id];
  const children: DenormalizedEntry<E>[] = (table.childrenById[id] || [])
    .filter(childId => isNotUndefined(table.entriesById[childId]))
    .map(childId => denormalizeEntry(table, childId));

  const newEntry: DenormalizedEntry<E> = { ...entry, children };
  return newEntry;
}
