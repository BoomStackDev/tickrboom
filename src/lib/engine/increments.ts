export function getDynamicIncrements(netWorth: number): number[] {
  if (netWorth < 1_000_000) return [500, 1000, 2500, 5000];
  if (netWorth < 10_000_000) return [1000, 5000, 10000, 100000];
  if (netWorth < 1_000_000_000) return [5000, 10000, 100000, 1000000];
  return [10000, 50000, 1000000, 10000000];
}
