export class GenericMap<K, V> extends Map<any, V> {
    public set(key: K, value: V): this {
        return super.set(JSON.stringify(key), value);
    }

    public get(key: K): V | undefined {
        return super.get(JSON.stringify(key));
    }
  
    public delete(x: K): boolean {
      return super.delete(JSON.stringify(x));
    }
  
    public has(x: K): boolean {
      return super.has(JSON.stringify(x));
    }

    public keyList(): Array<K> {
      return Array.from(super.keys()).map((k) => JSON.parse(k));
    }

    public entryList(): Array<[K, V]> {
      return Array.from(super.entries()).map(([k ,v]) => [JSON.parse(k), v]);
    }
}
  