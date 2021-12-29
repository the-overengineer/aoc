import { GenericMap } from './GenericMap';

export class Counter<T> extends GenericMap<T, number> {
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