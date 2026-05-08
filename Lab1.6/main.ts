// ЛАБОРАТОРНА РОБОТА 1.6, ВАРІАНТ 8

function generateArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 100000));
  return arr;
}

function cloneArray(arr: number[]): number[] {
  return arr.slice();
}

class MinHeap {
  private data: number[] = [];

  public size(): number {
    return this.data.length;
  }

  public push(x: number): void {
    this.data.push(x);
    this.siftUp(this.data.length - 1);
  }

  public pop(): number | null {
    if (this.data.length === 0) return null;
    const res = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return res;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p] <= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < n && this.data[l] < this.data[smallest]) smallest = l;
      if (r < n && this.data[r] < this.data[smallest]) smallest = r;
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}

function heapSortByPriorityQueue(arr: number[]): number[] {
  const heap = new MinHeap();
  for (const x of arr) heap.push(x);
  const res: number[] = [];
  while (heap.size() > 0) res.push(heap.pop()!);
  return res;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

function heapSortClassic(arr: number[]): void {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function timeIt(fn: () => void, repeats = 3): number {
  let total: bigint = 0n;
  for (let i = 0; i < repeats; i++) {
    const t0 = process.hrtime.bigint();
    fn();
    const t1 = process.hrtime.bigint();
    total += BigInt(t1 - t0);
  }
  return Number(total / BigInt(repeats)); // ns
}

function level1Timings(): void {
  console.log("РІВЕНЬ 1: Пірамідальне базове (черга)");
  const N = 100;
  const sizes = [N, N ** 2, N ** 3];

  const rows: { size: number; time_ns: number }[] = [];
  for (const size of sizes) {
    const base = generateArray(size);
    const t = timeIt(() => {
      const arr = cloneArray(base);
      heapSortByPriorityQueue(arr);
    });
    rows.push({ size, time_ns: t });
  }

  console.table(rows);
}

function level2Timings(): void {
  console.log("\nРІВЕНЬ 2: Черга vs Класичне пірамідальне");
  const N = 100;
  const sizes = [N, N ** 2, N ** 3];

  const rows: { size: number; priority_queue_ns: number; classic_heap_ns: number }[] = [];
  for (const size of sizes) {
    const base = generateArray(size);

    const t1 = timeIt(() => {
      const arr = cloneArray(base);
      heapSortByPriorityQueue(arr);
    });

    const t2 = timeIt(() => {
      const arr = cloneArray(base);
      heapSortClassic(arr);
    });

    rows.push({ size, priority_queue_ns: t1, classic_heap_ns: t2 });
  }

  console.table(rows);
}

function level3Timings(): void {
  console.log("\nРІВЕНЬ 3: Вплив послідовності (N=10000)");
  const size = 10000;

  const sorted = generateArray(size).sort((a, b) => a - b);
  const reversed = cloneArray(sorted).reverse();
  const randomArr = generateArray(size);

  const tSorted = timeIt(() => {
    const arr = cloneArray(sorted);
    heapSortClassic(arr);
  });

  const tReversed = timeIt(() => {
    const arr = cloneArray(reversed);
    heapSortClassic(arr);
  });

  const tRandom = timeIt(() => {
    const arr = cloneArray(randomArr);
    heapSortClassic(arr);
  });

  const rows = [
    { sequence: "sorted", time_ns: tSorted },
    { sequence: "reversed", time_ns: tReversed },
    { sequence: "random", time_ns: tRandom },
  ];

  console.table(rows);
}

level1Timings();
level2Timings();
level3Timings();