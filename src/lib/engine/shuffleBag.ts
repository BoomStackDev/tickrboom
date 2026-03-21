/**
 * Shuffle-bag randomizer — guarantees even distribution of values.
 * Each value appears exactly once per cycle before the bag refills.
 * Max repeat of any value across bag boundaries is 2.
 */
export class ShuffleBag<T> {
  private readonly items: readonly T[];
  private pool: T[] = [];

  constructor(items: readonly T[]) {
    this.items = items;
  }

  draw(): T {
    if (this.pool.length === 0) {
      this.pool = [...this.items];
      // Fisher-Yates shuffle
      for (let i = this.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pool[i], this.pool[j]] = [this.pool[j], this.pool[i]];
      }
    }
    return this.pool.pop()!;
  }
}
