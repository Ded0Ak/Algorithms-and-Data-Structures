// ЛАБОРАТОРНА РОБОТА 2.1, ВАРІАНТ 8
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

//Рівень 1
function fIntegral(x: number): number {
  return Math.sqrt(6 * x + 5);
}

function integrateRect(a: number, b: number, h: number): number {
  let sum = 0;
  for (let x = a; x < b; x += h) {
    const mid = x + h / 2;
    sum += fIntegral(mid);
  }
  return sum * h;
}

function integrateTrapezoid(a: number, b: number, h: number): number {
  let sum = 0;
  for (let x = a + h; x < b; x += h) {
    sum += fIntegral(x);
  }
  return h * (0.5 * fIntegral(a) + sum + 0.5 * fIntegral(b));
}

function integrateSimpson(a: number, b: number, h: number): number {
  const n = Math.round((b - a) / h);
  if (n % 2 !== 0) {
    throw new Error("Для методу Сімпсона потрібна парна кількість підінтервалів.");
  }
  let sum1 = 0; // odd
  let sum2 = 0; // even
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    if (i % 2 === 0) sum2 += fIntegral(x);
    else sum1 += fIntegral(x);
  }
  return (h / 3) * (fIntegral(a) + fIntegral(b) + 4 * sum1 + 2 * sum2);
}

// Рівень 2
function y(x: number): number {
  return (x - 2) * (x - 2) - x;
}
function yPrime(x: number): number {
  return 2 * (x - 2) - 1;
}

function bisection(a: number, b: number, eps: number): number | null {
  if (y(a) * y(b) > 0) return null;
  let left = a, right = b;
  while (Math.abs(right - left) > eps) {
    const mid = (left + right) / 2;
    if (y(left) * y(mid) <= 0) right = mid;
    else left = mid;
  }
  return (left + right) / 2;
}

function newton(x0: number, eps: number, maxIter = 100): number | null {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const d = yPrime(x);
    if (Math.abs(d) < 1e-12) return null;
    const x1 = x - y(x) / d;
    if (Math.abs(x1 - x) < eps) return x1;
    x = x1;
  }
  return null;
}

function secant(a: number, b: number, eps: number, maxIter = 100): number | null {
  let x0 = a, x1 = b;
  let f0 = y(x0), f1 = y(x1);
  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(f1 - f0) < 1e-12) return null;
    const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
    if (Math.abs(x2 - x1) < eps) return x2;
    x0 = x1; f0 = f1;
    x1 = x2; f1 = y(x1);
  }
  return null;
}

// Рівень 3
function fODE(x: number, y: number): number {
  return (y * y - y) / x;
}

function rungeKutta3(x0: number, y0: number, xEnd: number, h: number): { x: number, y: number }[] {
  if (x0 === 0) throw new Error("x0 не може дорівнювати 0 (ділення на x).");
  const result: { x: number, y: number }[] = [];
  let x = x0, yv = y0;
  result.push({ x, y: yv });

  const steps = Math.round((xEnd - x0) / h);
  for (let i = 0; i < steps; i++) {
    const k1 = h * fODE(x, yv);
    const k2 = h * fODE(x + h / 2, yv + k1 / 2);
    const k3 = h * fODE(x + h, yv - k1 + 2 * k2);
    yv = yv + (k1 + 4 * k2 + k3) / 6;
    x = x + h;
    result.push({ x, y: yv });
  }
  return result;
}

// ========== MAIN ==========
async function main() {
  console.log("Варіант 8");
  console.log("Рівень 1: інтеграл ∫[0..10] sqrt(6x+5) dx, h=0.2");

  const a = 0, b = 10, h = 0.2;
  console.log("Метод прямокутників:", integrateRect(a, b, h));
  console.log("Метод трапецій:", integrateTrapezoid(a, b, h));
  console.log("Метод Сімпсона:", integrateSimpson(a, b, h));

  console.log("\nРівень 2: y(x)=(x-2)^2 - x");
  const ia = parseFloat(await question("Введіть ліву межу інтервалу: "));
  const ib = parseFloat(await question("Введіть праву межу інтервалу: "));
  const eps = parseFloat(await question("Введіть точність eps (напр. 1e-6): "));

  const rootB = bisection(ia, ib, eps);
  console.log("Половинчасте ділення:", rootB ?? "Немає кореня на інтервалі");

  const rootN = newton((ia + ib) / 2, eps);
  console.log("Дотичних (Ньютона):", rootN ?? "Не вдалося");

  const rootS = secant(ia, ib, eps);
  console.log("Хорд:", rootS ?? "Не вдалося");

  console.log("\nРівень 3: dy/dx = (y^2 - y)/x, метод Рунге–Кутти 3-го порядку");
  const x0 = parseFloat(await question("Введіть x0 (не 0): "));
  const y0 = parseFloat(await question("Введіть y0: "));
  const xEnd = parseFloat(await question("Введіть xкін: "));
  const hODE = parseFloat(await question("Введіть крок h: "));

  const table = rungeKutta3(x0, y0, xEnd, hODE);
  console.log("\n x\t\t y");
  for (const row of table) {
    console.log(`${row.x.toFixed(6)}\t ${row.y.toFixed(6)}`);
  }

  rl.close();
}

main().catch((e) => {
  console.error("Помилка:", e.message);
  rl.close();
});