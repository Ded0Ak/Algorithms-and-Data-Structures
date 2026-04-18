// ЛАБОРАТОРНА РОБОТА 1.1, ВАРІАНТ 8

enum Gender {
  Female = "Female",
  Male = "Male",
}

interface PersonName {
  name: string;
  gender: Gender;
}

// РІВЕНЬ 1 
class ArrayQueue<T> {
  private data: T[];
  private count: number;    
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.data = new Array<T>(capacity);
    this.count = 0;
  }

  public enqueue(value: T): boolean {
    if (this.count === this.capacity) return false;
    this.data[this.count] = value;
    this.count++;
    return true;
  }

  public dequeue(): T {
    if (this.count === 0) {
      throw new Error("Черга порожня, гнеможливо видалити елемент");
    }

    const removed = this.data[0];

    for (let i = 1; i < this.count; i++) {
      this.data[i - 1] = this.data[i];
    }

    this.count--;
    return removed;
  }

  public print(title?: string): void {
    if (title) console.log(title);
    console.log(`[${this.data.slice(0, this.count).join(", ")}]`);
  }
}

// РІВЕНЬ 2
class StackNode<T> {
  public data: T;
  public next: StackNode<T> | null;

  constructor(data: T, next: StackNode<T> | null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedStack<T> {
  private top: StackNode<T> | null = null; 


  public isEmpty(): boolean {
    return this.top === null;
  }

  public push(value: T): void {
    this.top = new StackNode(value, this.top); 
  }

  public pop(): T {
    if (this.top === null) {
      throw new Error("Стек порожній, неможливо видалити елемент");
    }

    const removed = this.top.data;
    this.top = this.top.next;
    return removed;
  }

  public peek(): T {
    if (this.top === null) {
      throw new Error("Стек порожній."); 
    }
    return this.top.data;
  }

  public toArrayFromTop(): T[] {
    const result: T[] = [];
    let current = this.top;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  public print(
    formatter: (x: T) => string = (x) => String(x),
    title?: string
  ): void {
    if (title) console.log(title);
    const arr = this.toArrayFromTop().map(formatter);
    console.log(`TOP -> [${arr.join(" | ")}]`);
  }
}

// РІВЕНЬ 3 
function splitNamesFromStackToTwoQueues(
  stack: LinkedStack<PersonName>,
  queueFemale: ArrayQueue<string>,
  queueMale: ArrayQueue<string>
): void {
  while (!stack.isEmpty()) {
    const person = stack.pop();

    if (person.gender === Gender.Female) {
      const ok = queueFemale.enqueue(person.name);
      if (!ok) {
        throw new Error("Черга жіночих імен переповнена.");
      }
    } else {
      const ok = queueMale.enqueue(person.name);
      if (!ok) {
        throw new Error("Черга чоловічих імен переповнена.");
      }
    }
  }
}

// DEMO 
function level1Demo(): void {
  console.log("РІВЕНЬ 1");
  const queue = new ArrayQueue<string>(10);

  queue.enqueue("apple");
  queue.enqueue("banana");
  queue.enqueue("cherry");
  queue.enqueue("orange");
  queue.enqueue("strawberry");
  queue.print("Після вставки елементів:");

  console.log("Видалено:", queue.dequeue());
  console.log("Видалено:", queue.dequeue());
  queue.print("Після видалення 2 елементів:");
}

function level2Demo(): LinkedStack<PersonName> {
  console.log("\nРІВЕНЬ 2");
  const stack = new LinkedStack<PersonName>();

  const data: PersonName[] = [
    { name: "Andriy", gender: Gender.Male },   
    { name: "Olena", gender: Gender.Female },  
    { name: "Maksym", gender: Gender.Male },   
    { name: "Iryna", gender: Gender.Female },  
    { name: "Taras", gender: Gender.Male },    
    { name: "Sofiia", gender: Gender.Female }, 
  ];

  data.forEach((x) => stack.push(x));

  stack.print((p) => `${p.name}:${p.gender}`, "Стек після вставки:");

  console.log("Видалено:", stack.pop());
  console.log("Видалено:", stack.pop());

  stack.print((p) => `${p.name}:${p.gender}`, "Стек після видалення 2 елементів:");

  return stack;
}

function level3Demo(): void {
  console.log("\nРІВЕНЬ 3");
  const stack = new LinkedStack<PersonName>();

  const data: PersonName[] = [
    { name: "Bohdan", gender: Gender.Male },
    { name: "Anna", gender: Gender.Female },
    { name: "Denys", gender: Gender.Male },
    { name: "Kateryna", gender: Gender.Female },
    { name: "Ihor", gender: Gender.Male },
    { name: "Mariia", gender: Gender.Female },
  ];

  data.forEach((x) => stack.push(x));

  const femaleQueue = new ArrayQueue<string>(5);
  const maleQueue = new ArrayQueue<string>(5);

  console.log("Початковий стек:");
  stack.print((p) => `${p.name}:${p.gender}`);

  splitNamesFromStackToTwoQueues(stack, femaleQueue, maleQueue);

  console.log("Стек після переносу:");
  stack.print((p) => `${p.name}:${p.gender}`);

  femaleQueue.print("Перша черга (жіночі імена):");
  maleQueue.print("Друга черга (чоловічі імена):");
}

level1Demo();
level2Demo();
level3Demo();