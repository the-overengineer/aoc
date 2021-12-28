export class GenericSet<T> extends Set<any> {
  public add(x: T): this {
    return super.add(JSON.stringify(x));
  }

  public delete(x: T): boolean {
    return super.delete(JSON.stringify(x));
  }

  public has(x: T): boolean {
    return super.has(JSON.stringify(x));
  }

  public toList(): T[] {
    const items: T[] = [];

    for (const item of this) {
      items.push(JSON.parse(item));
    }

    return items;
  }
}
