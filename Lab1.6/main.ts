// ЛАБОРАТОРНА РОБОТА 1.6, ВАРІАНТ 8

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const OUT_DIR = "out";
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

function saveAllChartsHTML(
  filename: string,
  level1: { size: number; time_s: number }[],
  level2: { size: number; priority_queue_s: number; classic_heap_s: number }[],
  level3: { sequence: string; time_s: number }[]
) {
  const html = `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8"/>
  <title>ЛР 1.6 — Варіант 8 (усі графіки)</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: system-ui, Arial, sans-serif; margin: 20px; }
    canvas { max-width: 900px; margin: 10px 0 30px; }
  </style>
</head>
<body>
  <h1>ЛР 1.6 — Варіант 8</h1>

  <h2>Рівень 1: Пірамідальне базове (черга)</h2>
  <canvas id="c1" width="900" height="500"></canvas>

  <h2>Рівень 2: Черга vs Класичне пірамідальне</h2>
  <canvas id="c2" width="900" height="500"></canvas>

  <h2>Рівень 3: Вплив послідовності (N=10000)</h2>
  <canvas id="c3" width="900" height="500"></canvas>

  <script>
    const l1 = ${JSON.stringify(level1)};
    const l2 = ${JSON.stringify(level2)};
    const l3 = ${JSON.stringify(level3)};

    new Chart(document.getElementById("c1"), {
      type: "line",
      data: {
        labels: l1.map(r => r.size),
        datasets: [{ label: "time (s)", data: l1.map(r => r.time_s), borderColor: "blue" }]
      }
    });

    new Chart(document.getElementById("c2"), {
      type: "line",
      data: {
        labels: l2.map(r => r.size),
        datasets: [
          { label: "priority queue", data: l2.map(r => r.priority_queue_s), borderColor: "blue" },
          { label: "classic heap", data: l2.map(r => r.classic_heap_s), borderColor: "red" }
        ]
      }
    });

    new Chart(document.getElementById("c3"), {
      type: "line",
      data: {
        labels: l3.map(r => r.sequence),
        datasets: [{ label: "time (s)", data: l3.map(r => r.time_s), borderColor: "green" }]
      }
    });
  </script>
</body>
</html>`;

  const full = resolve(OUT_DIR, filename);
  writeFileSync(full, html, "utf8");
  console.log(`Графіки: file://${full}`);
}

function generateArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 100000));
  return arr;
}
function cloneArray(arr: number[]): number[] { return arr.slice(); }

// РІВЕНЬ 1
class MinHeap {
  private data: number[] = [];
  public size(): number { return this.data.length; }
  public push(x: number): void { this.data.push(x); this.siftUp(this.data.length - 1); }
  public pop(): number | null {
    if (this.data.length === 0) return null;
    const res = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) { this.data[0] = last; this.siftDown(0); }
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

// РІВЕНЬ 2 + 3
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

function timeItSeconds(fn: () => void, repeats = 3): number {
  let total = 0;
  for (let i = 0; i < repeats; i++) {
    const t0 = Date.now();
    fn();
    const t1 = Date.now();
    total += t1 - t0;
  }
  return total / repeats / 1000;
}

// Demo
function level1Timings(): { size: number; time_s: number }[] {
  console.log("РІВЕНЬ 1: Пірамідальне базове (черга)");
  const N = 100;
  const sizes = [N, N ** 2, N ** 3];
  const rows: { size: number; time_s: number }[] = [];
  for (const size of sizes) {
    const base = generateArray(size);
    const t = timeItSeconds(() => heapSortByPriorityQueue(cloneArray(base)));
    rows.push({ size, time_s: t });
  }
  console.table(rows);
  return rows;
}

function level2Timings(): { size: number; priority_queue_s: number; classic_heap_s: number }[] {
  console.log("\nРІВЕНЬ 2: Черга vs Класичне пірамідальне");
  const N = 100;
  const sizes = [N, N ** 2, N ** 3];
  const rows: { size: number; priority_queue_s: number; classic_heap_s: number }[] = [];
  for (const size of sizes) {
    const base = generateArray(size);
    const t1 = timeItSeconds(() => heapSortByPriorityQueue(cloneArray(base)));
    const t2 = timeItSeconds(() => heapSortClassic(cloneArray(base)));
    rows.push({ size, priority_queue_s: t1, classic_heap_s: t2 });
  }
  console.table(rows);
  return rows;
}

function level3Timings(): { sequence: string; time_s: number }[] {
  console.log("\nРІВЕНЬ 3: Вплив послідовності (N=10000)");
  const size = 10000;
  const sorted = generateArray(size).sort((a, b) => a - b);
  const reversed = cloneArray(sorted).reverse();
  const randomArr = generateArray(size);

  const tSorted = timeItSeconds(() => heapSortClassic(cloneArray(sorted)));
  const tReversed = timeItSeconds(() => heapSortClassic(cloneArray(reversed)));
  const tRandom = timeItSeconds(() => heapSortClassic(cloneArray(randomArr)));

  const rows = [
    { sequence: "sorted", time_s: tSorted },
    { sequence: "reversed", time_s: tReversed },
    { sequence: "random", time_s: tRandom },
  ];
  console.table(rows);
  return rows;
}

const r1 = level1Timings();
const r2 = level2Timings();
const r3 = level3Timings();

saveAllChartsHTML("all_levels.html", r1, r2, r3);