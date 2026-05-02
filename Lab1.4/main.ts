// ЛАБОРАТОРНА РОБОТА 1.4, ВАРІАНТ 8
// РІВЕНЬ 1: масив, розподіленого підрахунку, за місяцем народження
// РІВЕНЬ 2: односпрямований сисок, розподіленого підрахунку, за місяцем народження
// РІВЕНЬ 3: швидкий з розділенням на три частини, за місяцем народження

class Student {
  constructor(
    public lastName: string,
    public day: number,
    public month: number,
    public year: number
  ) {
    if (month < 1 || month > 12) throw new Error("Місяць має бути в діапазоні 1..12");
  }

  public key(): number {
    return this.month;
  }

  public toString(): string {
    return `${this.month.toString().padStart(2, "0")} | ${this.lastName} ${this.day}.${this.month}.${this.year}`;
  }

  public static random(): Student {
    const lastNames = ["Іваненко", "Петренко", "Сидоренко", "Мельник", "Коваль", "Шевченко"];
    const rnd = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
    const ln = lastNames[rnd(0, lastNames.length - 1)];
    const month = rnd(1, 12);
    const day = rnd(1, 28);
    const year = rnd(2002, 2006);
    return new Student(ln, day, month, year);
  }
}

function printStudents(title: string, arr: Student[]): void {
  console.log(title);
  arr.forEach((s) => console.log(s.toString()));
}

// РІВЕНЬ 1
function  countingSortByMonth(arr: Student[]): Student[] {
  const buckets: Student[][] = Array.from({ length: 12 }, () => []);
  for (const s of arr) buckets[s.key() - 1].push(s);
  return buckets.flat();
}

// РІВЕНЬ 2
class ListNode {
  public next: ListNode | null = null;
  constructor(public value: Student) {}
}

class SinglyLinkedList {
  public head: ListNode | null = null;

  public push(value: Student): void {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  public toArray(): Student[] {
    const res: Student[] = [];
    let cur = this.head;
    while (cur) {
      res.push(cur.value);
      cur = cur.next;
    }
    return res;
  }

  public fromArray(arr: Student[]): void {
    this.head = null;
    arr.forEach((s) => this.push(s));
  }

  public sortByMonthCounting(): void {
    const sorted = countingSortByMonth(this.toArray());
    this.fromArray(sorted);
  }
}

// РІВЕНЬ 3
function quickSort3WayByMonth(arr: Student[], lo = 0, hi = arr.length - 1): void {
  if (lo >= hi) return;

  let lt = lo;
  let gt = hi;
  const pivot = arr[lo].key();
  let i = lo + 1;

  while (i <= gt) {
    if (arr[i].key() < pivot) {
      [arr[i], arr[lt]] = [arr[lt], arr[i]];
      i++;
      lt++;
    } else if (arr[i].key() > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }

  quickSort3WayByMonth(arr, lo, lt - 1);
  quickSort3WayByMonth(arr, gt + 1, hi);
}

//DEMO
function level1Demo(): void {
  console.log("РІВЕНЬ 1");
  const arr: Student[] = [];
  for (let i = 0; i < 8; i++) arr.push(Student.random());

  printStudents("До сортування:", arr);
  const sorted = countingSortByMonth(arr);
  printStudents("Після сортування:", sorted);
}

function level2Demo(): void {
  console.log("\nРІВЕНЬ 2");
  const list = new SinglyLinkedList();
  for (let i = 0; i < 8; i++) list.push(Student.random());

  printStudents("До сортування:", list.toArray());
  list.sortByMonthCounting();
  printStudents("Після сортування:", list.toArray());
}

function level3Demo(): void {
  console.log("\nРІВЕНЬ 3");
  const arr: Student[] = [];
  for (let i = 0; i < 8; i++) arr.push(Student.random());

  printStudents("До сортування:", arr);
  quickSort3WayByMonth(arr);
  printStudents("Після сортування:", arr);
}

level1Demo();
level2Demo();
level3Demo();