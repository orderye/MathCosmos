/** 埃拉托斯特尼筛；索引即被筛数，true 表示素数 */
export function sievePrimes(limit: number): boolean[] {
  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = false;
  }
  return isPrime;
}

export function primesUpTo(limit: number): number[] {
  const isPrime = sievePrimes(limit);
  const out: number[] = [];
  for (let i = 2; i <= limit; i++) if (isPrime[i]) out.push(i);
  return out;
}

export function isTwinPrime(p: number, isPrime: (n: number) => boolean): boolean {
  return isPrime(p) && isPrime(p + 2);
}

/** 欧拉素数生成多项式 P(k) = k² + k + 41 */
export function eulerPrime(k: number): number {
  return k * k + k + 41;
}

/** 素数在升序素数表中的下标；非素数返回 -1 */
export function primeIndex(value: number, isPrime: (n: number) => boolean): number {
  if (!isPrime(value)) return -1;
  let idx = 0;
  for (let n = 2; n < value; n++) if (isPrime(n)) idx++;
  return idx;
}
