import { GenericMap } from './GenericMap';

export class Counter<T> extends GenericMap<T, number> {
    public static clone<T>(counter: Counter<T>): Counter<T> {
        const copy = new Counter<T>();

        counter.entryList().forEach(([k, v]) => {
            copy.set(k, v);
        });

        return copy;
    }

    public override get(key: T): number {
        return super.get(key) ?? 0;
    }

    public increment(key: T, by: number = 1): void {
        this.set(key, Math.max(0, this.get(key) + by));
    }

    public decrement(key: T, by: number = 1): void {
        this.set(key, Math.max(0, this.get(key) - by));
    }
}