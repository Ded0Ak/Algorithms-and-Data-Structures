// ЛАБОРАТОРНА РОБОТА 1.3, ВАРІАНТ 8

class Studentt {
  constructor(
    public lastName: string,
    public firstName: string,
    public height: number,      
    public weight: number,      
    public studentId: number    
  ) {
    if (height <= 0) throw new Error("Зріст має бути > 0");
    if (weight <= 0) throw new Error("Маса має бути > 0");
    if (studentId < 0) throw new Error("Номер студентського квитка має бути невід'ємним");
  }

  public static random(studentId: number): Studentt {
    const lastNames = ["Іваненко", "Петренко", "Шевченко", "Коваленко", "Бондаренко", "Мельник"];
    const firstNames = ["Олег", "Анна", "Ірина", "Максим", "Софія", "Дмитро"];

    const rndInt = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
    const pick = <T>(arr: T[]) => arr[rndInt(0, arr.length - 1)];

    const h = rndInt(155, 195);
    const ideal = h - 110;
    const variants = [ideal, ideal, ideal - 5, ideal + 7, ideal + 12];
    const w = variants[rndInt(0, variants.length - 1)];

    return new Studentt(pick(lastNames), pick(firstNames), h, w, studentId);
  }

  public isIdealWeight(): boolean {
    return this.height - 110 === this.weight;
  }

  public key(): number {
    return this.studentId;
  }

  public toRow(): string {
    return `${this.lastName.padEnd(12)} | ${this.firstName.padEnd(8)} | ${String(this.height).padStart(3)} | ${String(this.weight).padStart(3)} | ${String(this.studentId).padStart(6)} | ${this.isIdealWeight() ? "так" : "ні"}`;
  }
}

class TreeNode {
  constructor(
    public data: Studentt,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

// РІВЕНЬ 1
class BinarySearchTreeLevel1 {
  protected root: TreeNode | null = null;

  public insert(student: Studentt): boolean {
    const node = new TreeNode(student);

    if (this.root === null) {
      this.root = node;
      return true;
    }

    let current: TreeNode | null = this.root;

    while (current !== null) {
      if (student.key() === current.data.key()) {
        return false;
      }

      if (student.key() < current.data.key()) {
        if (current.left === null) {
          current.left = node;
          return true;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = node;
          return true;
        }
        current = current.right;
      }
    }

    return false;
  }

  protected inOrder(node: TreeNode | null, visit: (s: Studentt) => void): void {
    if (node === null) return;
    this.inOrder(node.left, visit);
    visit(node.data);
    this.inOrder(node.right, visit);
  }

  public printTable(title?: string): void {
    if (title) console.log(title);
    console.log("Прізвище     | Ім'я     | Зр  | Мас | Квиток | Ідеальна маса");
    console.log("-------------+----------+-----+-----+--------+---------------");

    let count = 0;
    this.inOrder(this.root, (s) => {
      console.log(s.toRow());
      count++;
    });

    if (count === 0) console.log("<дерево порожнє>");
  }
}

// РІВЕНЬ 2 + РІВЕНЬ 3
class BinarySearchTreeLevel2 extends BinarySearchTreeLevel1 {
  public findIdealWeightStudents(): Studentt[] {
    const result: Studentt[] = [];
    this.inOrder(this.root, (s) => {
      if (s.isIdealWeight()) result.push(s);
    });
    return result;
  }

  // РІВЕНЬ 3
  public removeIdealWeightStudents(): number {
    const toDelete: number[] = [];
    this.inOrder(this.root, (s) => {
      if (s.isIdealWeight()) toDelete.push(s.key());
    });

    let removed = 0;
    for (const key of toDelete) {
      const ok = this.deleteByKey(key);
      if (ok) removed++;
    }
    return removed;
  }

  public deleteByKey(key: number): boolean {
    const [newRoot, deleted] = this.deleteRec(this.root, key);
    this.root = newRoot;
    return deleted;
  }

  private deleteRec(node: TreeNode | null, key: number): [TreeNode | null, boolean] {
    if (node === null) return [null, false];

    if (key < node.data.key()) {
      const [newLeft, deleted] = this.deleteRec(node.left, key);
      node.left = newLeft;
      return [node, deleted];
    }

    if (key > node.data.key()) {
      const [newRight, deleted] = this.deleteRec(node.right, key);
      node.right = newRight;
      return [node, deleted];
    }

    if (node.left === null && node.right === null) {
      return [null, true];
    }

    if (node.left === null) {
      return [node.right, true];
    }

    if (node.right === null) {
      return [node.left, true];
    }

    const successor = this.findMin(node.right);
    node.data = successor.data;

    const [newRight] = this.deleteRec(node.right, successor.data.key());
    node.right = newRight;

    return [node, true];
  }

  private findMin(node: TreeNode): TreeNode {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  public printSearchResult(items: Studentt[], title?: string): void {
    if (title) console.log(title);
    if (items.length === 0) {
      console.log("За заданим критерієм вузлів не знайдено.");
      return;
    }

    console.log("Прізвище     | Ім'я      | Зр | Мас | Квиток | Ідеальна маса");
    console.log("-------------+-----------+----+-----+--------+---------------");
    items.forEach((s) => console.log(s.toRow()));
  }
}

// DEMO
function level1Demo(): void {
  console.log("РІВЕНЬ 1");
  const tree = new BinarySearchTreeLevel1();

  const students: Studentt[] = [
    new Studentt("Іваненко", "Олег", 180, 70, 5008),
    new Studentt("Петренко", "Анна", 165, 55, 5003),
    new Studentt("Шевченко", "Ірина", 172, 62, 5010),
    new Studentt("Коваленко", "Максим", 190, 80, 5001),
    new Studentt("Бондаренко", "Софія", 160, 50, 5006),
    new Studentt("Мельник", "Дмитро", 175, 65, 5012)
  ];

  students.forEach((s) => {
    const ok = tree.insert(s);
    if (!ok) console.log(`Не вдалося вставити (дубль ключа): ${s.studentId}`);
  });

  tree.printTable("Дерево (послідовний обхід):");
}

function level2Demo(): BinarySearchTreeLevel2 {
  console.log("\nРІВЕНЬ 2");
  const tree = new BinarySearchTreeLevel2();

  const students: Studentt[] = [];
  const ids = [40, 20, 60, 10, 30, 50, 70, 25, 35];

  ids.forEach((id) => students.push(Studentt.random(id)));
  students.forEach((s) => tree.insert(s));

  tree.printTable("Дерево (послідовний обхід):");

  const found = tree.findIdealWeightStudents();
  tree.printSearchResult(found, "\nРезультат пошуку (зріст - 110 = маса):");

  return tree;
}

function level3Demo(): void {
  console.log("\nРІВЕНЬ 3");
  const tree = new BinarySearchTreeLevel2();

  const students: Studentt[] = [
    new Studentt("A", "A", 180, 70, 40), 
    new Studentt("B", "B", 165, 55, 20), 
    new Studentt("C", "C", 177, 67, 60), 
    new Studentt("D", "D", 150, 40, 10), 
    new Studentt("E", "E", 170, 66, 30), 
    new Studentt("F", "F", 171, 61, 50), 
    new Studentt("G", "G", 190, 85, 70), 
    new Studentt("H", "H", 160, 50, 25), 
    new Studentt("I", "I", 168, 58, 35)  
  ];

  students.forEach((s) => tree.insert(s));

  tree.printTable("До видалення:");

  const removedCount = tree.removeIdealWeightStudents();
  console.log(`\nВидалено вузлів за критерієм (зріст - 110 = маса): ${removedCount}`);

  tree.printTable("Після видалення:");
}

level1Demo();
level2Demo();
level3Demo();