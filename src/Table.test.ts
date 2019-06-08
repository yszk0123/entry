import { Entry } from './Entry';
import { deleteEntries, insertEntries, selectEntries, Table, updateEntries } from './Table';

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

describe(insertEntries, () => {
  test('insert empty', () => {
    const table: ExampleTable = { childrenById: {}, entriesById: {} };
    Object.freeze(table);

    {
      const actual = insertEntries(table, []);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }
  });

  test('insert orphan', () => {
    const table: ExampleTable = { childrenById: {}, entriesById: {} };
    const entry: ExampleEntry = { id: 'id-1', parentId: null, value: 1 };
    Object.freeze(table);

    {
      const actual = insertEntries(table, [entry]);
      expect(actual.childrenById).toEqual({ 'id-1': [] });
      expect(actual.entriesById).toEqual({ 'id-1': entry });
    }
  });

  test('insert parent and child', () => {
    const table: ExampleTable = { childrenById: {}, entriesById: {} };
    const parent: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 2 };
    Object.freeze(table);

    {
      const actual = insertEntries(table, [parent, child]);
      expect(actual.childrenById).toEqual({ 'parent-1': ['child-1'], 'child-1': [] });
      expect(actual.entriesById).toEqual({ 'parent-1': parent, 'child-1': child });
    }

    {
      const actual = insertEntries(table, [child, parent]);
      expect(actual.childrenById).toEqual({ 'parent-1': ['child-1'], 'child-1': [] });
      expect(actual.entriesById).toEqual({ 'parent-1': parent, 'child-1': child });
    }
  });
});

describe(selectEntries, () => {
  test('entries are empty', () => {
    const table = createTable([]);

    {
      const actual = selectEntries(table, []);
      expect(actual).toEqual([]);
    }

    {
      const actual = selectEntries(table, ['nonExistent-1']);
      expect(actual).toEqual([]);
    }
  });

  test('entries are parent and child', () => {
    const parent: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 2 };
    const table = createTable([parent, child]);

    {
      const actual = selectEntries(table, [parent.id, child.id]);
      expect(actual).toEqual([parent, child]);
    }

    {
      const actual = selectEntries(table, [child.id, parent.id]);
      expect(actual).toEqual([child, parent]);
    }
  });
});

describe(updateEntries, () => {
  test('entries are empty', () => {
    const nonExistentEntry: ExampleEntry = { id: 'id-1', parentId: null, value: 2 };
    const table = createTable([]);

    {
      const actual = updateEntries(table, []);
      expect(actual.childrenById).toEqual(table.childrenById);
      expect(actual.entriesById).toEqual(table.entriesById);
    }

    {
      const actual = updateEntries(table, [nonExistentEntry]);
      expect(actual.childrenById).toEqual(table.childrenById);
      expect(actual.entriesById).toEqual(table.entriesById);
    }
  });

  test('entries are parent and child (parentId is not changed)', () => {
    const parent: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 2 };
    const newChild: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 3 };
    const table = createTable([parent, child]);

    {
      const actual = updateEntries(table, []);
      expect(actual.childrenById).toEqual(table.childrenById);
      expect(actual.entriesById).toEqual({ 'parent-1': parent, 'child-1': child });
    }

    {
      const actual = updateEntries(table, [newChild]);
      expect(actual.childrenById).toEqual(table.childrenById);
      expect(actual.entriesById).toEqual({ 'parent-1': parent, 'child-1': newChild });
    }
  });

  test('entries are parent and child (parentId is changed)', () => {
    const parent1: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const parent2: ExampleEntry = { id: 'parent-2', parentId: null, value: 2 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 3 };
    const newChild: ExampleEntry = { id: 'child-1', parentId: 'parent-2', value: 4 };
    const table = createTable([parent1, parent2, child]);

    {
      const actual = updateEntries(table, []);
      expect(actual.childrenById).toEqual({
        'parent-1': ['child-1'],
        'parent-2': [],
        'child-1': [],
      });
      expect(actual.entriesById).toEqual({
        'parent-1': parent1,
        'parent-2': parent2,
        'child-1': child,
      });
    }

    {
      const actual = updateEntries(table, [newChild]);
      expect(actual.childrenById).toEqual({
        'parent-1': [],
        'parent-2': ['child-1'],
        'child-1': [],
      });
      expect(actual.entriesById).toEqual({
        'parent-1': parent1,
        'parent-2': parent2,
        'child-1': newChild,
      });
    }
  });
});

describe(deleteEntries, () => {
  test('entries are empty', () => {
    const table = createTable([]);

    {
      const actual = deleteEntries(table, []);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }

    {
      const actual = deleteEntries(table, ['invalid-1']);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }
  });

  test('entries are parent and child', () => {
    const parent: ExampleEntry = { id: 'parent-1', parentId: null, value: 1 };
    const child: ExampleEntry = { id: 'child-1', parentId: 'parent-1', value: 2 };
    const table = createTable([parent, child]);

    {
      const actual = deleteEntries(table, []);
      expect(actual.childrenById).toEqual(table.childrenById);
      expect(actual.entriesById).toEqual(table.entriesById);
    }

    {
      const actual = deleteEntries(table, [child.id]);
      expect(actual.childrenById).toEqual({ 'parent-1': [] });
      expect(actual.entriesById).toEqual({ 'parent-1': parent });
    }

    {
      const actual = deleteEntries(table, [parent.id]);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }

    {
      const actual = deleteEntries(table, [parent.id, child.id]);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }

    {
      const actual = deleteEntries(table, [child.id, parent.id]);
      expect(actual.childrenById).toEqual({});
      expect(actual.entriesById).toEqual({});
    }
  });
});
