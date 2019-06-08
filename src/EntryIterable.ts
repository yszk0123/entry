import { Entry, Table } from './Entry';
import { isNotUndefined, isUndefined } from './Maybe';

export function createEntryIterable<E extends Entry>(table: Table<E>, id: string): Iterable<E> {
  return {
    *[Symbol.iterator]() {
      let entry = table.entriesById[id];
      const stack: string[] = [];
      while (isNotUndefined(entry)) {
        yield entry;

        const childIds = table.childrenById[entry.id];
        if (isNotUndefined(childIds)) {
          stack.push(...childIds);
        }

        const nextId = stack.shift();
        if (isUndefined(nextId)) {
          break;
        }

        entry = table.entriesById[nextId];
      }
    },
  };
}