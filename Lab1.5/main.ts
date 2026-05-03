// ЛАБОРАТОРНА РОБОТА 1.5, ВАРІАНТ 8

type Gender = "M" | "F";

class Student {
  constructor(
    public lastName: string,
    public firstName: string,
    public group: number,
    public gender: Gender,
    public avgGrade: number,
    public missedClasses: number
  ) {}

  public toString(): string {
    return `${this.group} | ${this.lastName} ${this.firstName} | ${this.gender} | ${this.avgGrade.toFixed(
      2
    )} | missed=${this.missedClasses}`;
  }

  public static random(): Student {
    const lastNames = ["Іваненко", "Петренко", "Сидоренко", "Мельник", "Коваль", "Шевченко"];
    const firstNames = ["Олег", "Марія", "Ірина", "Андрій", "Сергій", "Наталія"];
    const rnd = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
    const ln = lastNames[rnd(0, lastNames.length - 1)];
    const fn = firstNames[rnd(0, firstNames.length - 1)];
    const group = rnd(101, 105);
    const gender: Gender = Math.random() < 0.5 ? "M" : "F";
    const avg = Math.round((3 + Math.random() * 2.5) * 100) / 100;
    const missed = rnd(0, 120);
    return new Student(ln, fn, group, gender, avg, missed);
  }
}

function printStudents(title: string, arr: Student[]): void {
  console.log(title);
  arr.forEach((s) => console.log(s.toString()));
}

// РІВЕНЬ 1

function insertOrderedByGroup(arr: Student[], s: Student): void {
  let i = 0;
  while (i < arr.length && arr[i].group <= s.group) i++;
  arr.splice(i, 0, s);
}

function countFemaleHighAvgInGroup(arr: Student[], group: number): number {
  let count = 0;
  for (const s of arr) {
    if (s.group === group && s.gender === "F" && s.avgGrade > 4.5) count++;
  }
  return count;
}

// РІВЕНЬ 2

class BSTNode {
  public left: BSTNode | null = null;
  public right: BSTNode | null = null;
  constructor(public value: Student) {}
}

class BSTree {
  public root: BSTNode | null = null;

  private rotateRight(y: BSTNode): BSTNode {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    return x;
  }

  private rotateLeft(x: BSTNode): BSTNode {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    return y;
  }

  private insertRoot(node: BSTNode | null, value: Student): BSTNode {
    if (!node) return new BSTNode(value);
    if (value.missedClasses < node.value.missedClasses) {
      node.left = this.insertRoot(node.left, value);
      return this.rotateRight(node);
    } else {
      node.right = this.insertRoot(node.right, value);
      return this.rotateLeft(node);
    }
  }

  public insert(value: Student): void {
    this.root = this.insertRoot(this.root, value);
  }

  public searchByKey(key: number): Student | null {
    let cur = this.root;
    while (cur) {
      if (key === cur.value.missedClasses) return cur.value;
      cur = key < cur.value.missedClasses ? cur.left : cur.right;
    }
    return null;
  }

  public bfsPrint(): void {
    const res: string[] = [];
    const q: BSTNode[] = [];
    if (this.root) q.push(this.root);
    while (q.length) {
      const n = q.shift()!;
      res.push(n.value.toString());
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    console.log(res.join("\n"));
  }
}

// РІВЕНЬ 3

class SplayTree extends BSTree {
  private splay(node: BSTNode | null, key: number): BSTNode | null {
    if (!node) return null;

    if (key < node.value.missedClasses) {
      if (!node.left) return node;
      if (key < node.left.value.missedClasses) {
        node.left.left = this.splay(node.left.left, key);
        node = (this as any).rotateRight(node);
      } else if (key > node.left.value.missedClasses) {
        node.left.right = this.splay(node.left.right, key);
        if (node.left.right) node.left = (this as any).rotateLeft(node.left);
      }
      return node!.left ? (this as any).rotateRight(node) : node;
    } else if (key > node.value.missedClasses) {
      if (!node.right) return node;
      if (key > node.right.value.missedClasses) {
        node.right.right = this.splay(node.right.right, key);
        node = (this as any).rotateLeft(node);
      } else if (key < node.right.value.missedClasses) {
        node.right.left = this.splay(node.right.left, key);
        if (node.right.left) node.right = (this as any).rotateRight(node.right);
      }
      return node!.right ? (this as any).rotateLeft(node) : node;
    } else {
      return node;
    }
  }

  public insert(value: Student): void {
    if (!this.root) {
      this.root = new BSTNode(value);
      return;
    }
    this.root = this.splay(this.root, value.missedClasses);
    if (this.root!.value.missedClasses === value.missedClasses) return;

    const newNode = new BSTNode(value);
    if (value.missedClasses < this.root!.value.missedClasses) {
      newNode.right = this.root;
      newNode.left = this.root!.left;
      this.root!.left = null;
    } else {
      newNode.left = this.root;
      newNode.right = this.root!.right;
      this.root!.right = null;
    }
    this.root = newNode;
  }

  public searchByKey(key: number): Student | null {
    this.root = this.splay(this.root, key);
    if (this.root && this.root.value.missedClasses === key) return this.root.value;
    return null;
  }
}

// DEMO

function level1Demo(): void {
  console.log("РІВЕНЬ 1");
  const arr: Student[] = [];
  for (let i = 0; i < 20; i++) insertOrderedByGroup(arr, Student.random());

  printStudents("Масив (упорядкований за групою):", arr);

  const targetGroup = arr[Math.floor(Math.random() * arr.length)].group;
  const count = countFemaleHighAvgInGroup(arr, targetGroup);
  console.log(`\nКількість студенток з балом > 4.5 у групі ${targetGroup}: ${count}`);
}

function level2Demo(): void {
  console.log("\nРІВЕНЬ 2");
  const tree = new BSTree();
  const keys: number[] = [];

  for (let i = 0; i < 10; i++) {
    const s = Student.random();
    keys.push(s.missedClasses);
    tree.insert(s);
    console.log(`\nПісля додавання ${s.missedClasses}:`);
    tree.bfsPrint();
  }

  const key = keys[Math.floor(Math.random() * keys.length)];
  const found = tree.searchByKey(key);
  console.log(`\nПошук за ключем ${key}:`, found ? found.toString() : "null");
}

function level3Demo(): void {
  console.log("\nРІВЕНЬ 3");
  const tree = new SplayTree();
  const keys: number[] = [];

  for (let i = 0; i < 10; i++) {
    const s = Student.random();
    keys.push(s.missedClasses);
    tree.insert(s);
    console.log(`\nПісля додавання ${s.missedClasses}:`);
    tree.bfsPrint();
  }

  const key = keys[Math.floor(Math.random() * keys.length)];
  const found = tree.searchByKey(key);
  console.log(`\nПошук за ключем ${key}:`, found ? found.toString() : "null");
}

level1Demo();
level2Demo();
level3Demo();