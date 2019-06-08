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

export declare function insertEntries<E extends Entry>(table: Table<E>, entries: E[]): Table<E>;
export declare function deleteEntries<E extends Entry>(table: Table<E>, ids: string[]): Table<E>;
export declare function updateEntries<E extends Entry>(table: Table<E>, entries: E[]): Table<E>;
export declare function selectEntries<E extends Entry>(table: Table<E>, ids: string[]): E[];
