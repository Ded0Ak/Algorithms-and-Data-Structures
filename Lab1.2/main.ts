// ЛАБОРАТОРНА РОБОТА 1.2, ВАРІАНТ 8

class Circle {
  constructor(public x: number, public y: number, public r: number) {
    if (r <= 0) throw new Error("Радіус має бути > 0");
  }

  public static random(min = -30, max = 30, minR = 1, maxR = 10): Circle {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    return new Circle(rnd(min, max), rnd(min, max), rnd(minR, maxR));
  }

  public area(): number {
    return Math.PI * this.r * this.r;
  }

  public perimeter(): number {
    return 2 * Math.PI * this.r;
  }

  public key(): number {
    return this.area();
  }

  public toString(): string {
    return `Circle(x=${this.x.toFixed(2)}, y=${this.y.toFixed(2)}, r=${this.r.toFixed(2)}, S=${this.area().toFixed(2)}, P=${this.perimeter().toFixed(2)})`;
  }
}

// РІВЕНЬ 1
class HashTableLevel1 {
  private table: Array<Circle | null>;
  private readonly size: number;

  constructor(size: number) {
    if (size <= 0) throw new Error("Розмір хеш-таблиці має бути > 0");
    this.size = size;
    this.table = new Array<Circle | null>(size).fill(null);
  }

  private hashMultiplication(key: number): number {
    const A = 0.6180339887;
    const frac = (key * A) % 1;
    return Math.floor(this.size * frac);
  }

  public insert(circle: Circle): boolean {
    const index = this.hashMultiplication(circle.key());

    if (this.table[index] !== null) {
      return false;
    }

    this.table[index] = circle;
    return true;
  }

  public print(title?: string): void {
    if (title) console.log(title);
    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item === null) {
        console.log(`[${i}] -> <порожньо>`);
      } else {
        console.log(`[${i}] key(S)=${item.key().toFixed(2)} -> ${item.toString()}`);
      }
    }
  }
}

// РІВЕНЬ 2 + РІВЕНЬ 3
class HashTableLevel2 {
  private table: Array<Circle | null>;
  private deleted: boolean[];
  private readonly size: number;

  constructor(size: number) {
    if (size <= 0) throw new Error("Розмір хеш-таблиці має бути > 0");
    this.size = size;
    this.table = new Array<Circle | null>(size).fill(null);
    this.deleted = new Array<boolean>(size).fill(false);
  }

  private hashMultiplication(key: number): number {
    const A = 0.6180339887;
    const frac = (key * A) % 1;
    return Math.floor(this.size * frac);
  }

  private probe(baseIndex: number, i: number): number {
    const c1 = 1;
    const c2 = 3;
    return (baseIndex + c1 * i + c2 * i * i) % this.size;
  }

  public insert(circle: Circle): boolean {
    const base = this.hashMultiplication(circle.key());

    for (let i = 0; i < this.size; i++) {
      const idx = this.probe(base, i);

      if (this.table[idx] === null) {
        this.table[idx] = circle;
        this.deleted[idx] = false;
        return true;
      }
    }

    return false;
  }

  // РІВЕНЬ 3
  public removeByPerimeterGreaterThan(limit: number): number {
    let removed = 0;

    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item !== null && item.perimeter() > limit) {
        this.table[i] = null;
        this.deleted[i] = true;
        removed++;
      }
    }

    return removed;
  }

  public print(title?: string): void {
    if (title) console.log(title);
    for (let i = 0; i < this.size; i++) {
      const item = this.table[i];
      if (item !== null) {
        console.log(`[${i}] key(S)=${item.key().toFixed(2)} -> ${item.toString()}`);
      } else if (this.deleted[i]) {
        console.log(`[${i}] -> <видалено>`);
      } else {
        console.log(`[${i}] -> <порожньо>`);
      }
    }
  }
}

// DEMO
function level1Demo(): void {
  console.log("РІВЕНЬ 1");
  const table = new HashTableLevel1(11);

  let inserted = 0;
  while (inserted < 7) {
    const c = Circle.random();
    const ok = table.insert(c);
    if (ok) inserted++;
  }

  table.print("Хеш-таблиця (без колізій):");
}

function level2Demo(): HashTableLevel2 {
  console.log("\nРІВЕНЬ 2");
  const table = new HashTableLevel2(11);

  const circles: Circle[] = [];
  for (let i = 0; i < 9; i++) circles.push(Circle.random());

  circles.forEach((c) => {
    const ok = table.insert(c);
    if (!ok) {
      console.log("Не вдалося вставити елемент (колізія не розв'язана):", c.toString());
    }
  });

  table.print("Хеш-таблиця (з квадратичним зондуванням):");
  return table;
}

function level3Demo(): void {
  console.log("\nРІВЕНЬ 3");
  const table = new HashTableLevel2(11);

  const circles: Circle[] = [];
  for (let i = 0; i < 9; i++) circles.push(Circle.random());
  circles.forEach((c) => table.insert(c));

  table.print("До видалення:");

  const perimeterLimit = 35; 
  const removedCount = table.removeByPerimeterGreaterThan(perimeterLimit);

  console.log(`Видалено елементів (P > ${perimeterLimit}): ${removedCount}`);
  table.print("Після видалення:");
}

level1Demo();
level2Demo();
level3Demo();