import { Entry, insertEntries, Table } from './Table';
import { createTableIterable } from './TableIterable';

interface ExampleEntry extends Entry {
  value: number;
}

type ExampleTable = Table<ExampleEntry>;

function createTable(entries: ExampleEntry[]): ExampleTable {
  const table: ExampleTable = { childrenById: {}, entriesById: {} };
  const newTable = insertEntries(table, entries);
  Object.freeze(newTable);

  return newTable;
}

function toArray<T>(iterable: Iterable<T>): T[] {
  const result: T[] = [];
  for (let value of iterable) {
    result.push(value);
  }
  return result;
}

describe(createTableIterable, () => {
  test('iterate empty', () => {
    const table: ExampleTable = {
      childrenById: {},
      entriesById: {},
    };

    {
      const actual = toArray(createTableIterable(table, ''));
      expect(actual).toEqual([]);
    }
  });

  test('iterate orphan', () => {
    const entry: ExampleEntry = { id: 'id-1', parentId: null, value: 1 };
    const table = createTable([entry]);

    {
      const actual = toArray(createTableIterable(table, 'nonExistent-1'));
      expect(actual).toEqual([]);
    }

    {
      const actual = toArray(createTableIterable(table, 'id-1'));
      expect(actual).toEqual([entry]);
    }
  });

  test('iterate parent and child', () => {
    const parent: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 2 };
    const table = createTable([parent, child]);

    {
      const actual = toArray(createTableIterable(table, 'nonExistent-1'));
      expect(actual).toEqual([]);
    }

    {
      const actual = toArray(createTableIterable(table, 'parent-1'));
      expect(actual).toEqual([parent, child]);
    }

    {
      const actual = toArray(createTableIterable(table, 'child-1'));
      expect(actual).toEqual([child]);
    }
  });
});
