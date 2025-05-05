// TypeScript Inheritance Demo App
// This app demonstrates all types of inheritance in TypeScript

// 1. INTERFACE INHERITANCE
// Base interfaces
interface Identifiable {
    id: number;
    displayId(): string;
  }
  
  interface Nameable {
    name: string;
    displayName(): string;
  }
  
  // Interface inheritance (extending multiple interfaces)
  interface Entity extends Identifiable, Nameable {
    createdAt: Date;
    updatedAt: Date;
  }
  
  // 2. CLASS INHERITANCE
  // Base class
  class BaseModel implements Identifiable {
    id: number;
    
    constructor(id: number) {
      this.id = id;
    }
    
    displayId(): string {
      return `ID: ${this.id}`;
    }
    
    save(): void {
      console.log(`Saving model with ${this.displayId()}`);
    }
  }
  
  // Single inheritance (extends one class)
  class User extends BaseModel implements Nameable {
    name: string;
    email: string;
    
    constructor(id: number, name: string, email: string) {
      super(id); // Call parent constructor
      this.name = name;
      this.email = email;
    }
    
    displayName(): string {
      return `User: ${this.name}`;
    }
    
    // Method overriding
    override save(): void {
      console.log(`Saving user ${this.name} with ${this.displayId()}`);
    }
    
    sendEmail(subject: string): void {
      console.log(`Sending email to ${this.email} with subject: ${subject}`);
    }
  }
  
  // Multi-level inheritance
  class AdminUser extends User {
    role: string;
    permissions: string[];
    
    constructor(id: number, name: string, email: string, permissions: string[]) {
      super(id, name, email); // Call parent constructor
      this.role = "Admin";
      this.permissions = permissions;
    }
    
    // Method overriding
    override displayName(): string {
      return `${this.role}: ${this.name}`;
    }
    
    grantPermission(permission: string): void {
      this.permissions.push(permission);
      console.log(`Permission '${permission}' granted to ${this.name}`);
    }
  }
  
  // 3. ABSTRACT CLASS
  abstract class Shape {
    color: string;
    
    constructor(color: string) {
      this.color = color;
    }
    
    // Concrete method
    displayColor(): string {
      return `Color: ${this.color}`;
    }
    
    // Abstract methods (must be implemented by child classes)
    abstract calculateArea(): number;
    abstract calculatePerimeter(): number;
  }
  
  // Implementing abstract class
  class Circle extends Shape {
    radius: number;
    
    constructor(color: string, radius: number) {
      super(color);
      this.radius = radius;
    }
    
    calculateArea(): number {
      return Math.PI * this.radius * this.radius;
    }
    
    calculatePerimeter(): number {
      return 2 * Math.PI * this.radius;
    }
  }
  
  class Rectangle extends Shape {
    width: number;
    height: number;
    
    constructor(color: string, width: number, height: number) {
      super(color);
      this.width = width;
      this.height = height;
    }
    
    calculateArea(): number {
      return this.width * this.height;
    }
    
    calculatePerimeter(): number {
      return 2 * (this.width + this.height);
    }
  }
  
  // 4. GENERIC CLASS INHERITANCE
  class Collection<T> {
    protected items: T[];
    
    constructor() {
      this.items = [];
    }
    
    add(item: T): void {
      this.items.push(item);
    }
    
    getAll(): T[] {
      return this.items;
    }
  }
  
  // Inheriting generic class
  class SearchableCollection<T> extends Collection<T> {
    search(predicate: (item: T) => boolean): T[] {
      return this.items.filter(predicate);
    }
  }
  
  // Usage example of the inheritance types
  function runDemo() {
    console.log("--- TypeScript Inheritance Demo ---");
    
    // Class inheritance
    const user = new User(1, "John Doe", "john@example.com");
    console.log(user.displayId());
    console.log(user.displayName());
    user.save();
    user.sendEmail("Welcome!");
    
    // Multi-level inheritance
    const admin = new AdminUser(2, "Jane Smith", "jane@example.com", ["read", "write"]);
    console.log(admin.displayId());
    console.log(admin.displayName());
    admin.save();
    admin.sendEmail("Admin Access Granted");
    admin.grantPermission("delete");
    console.log(`Admin permissions: ${admin.permissions.join(", ")}`);
    
    // Abstract class inheritance
    const circle = new Circle("Red", 5);
    console.log(circle.displayColor());
    console.log(`Circle area: ${circle.calculateArea().toFixed(2)}`);
    console.log(`Circle perimeter: ${circle.calculatePerimeter().toFixed(2)}`);
    
    const rectangle = new Rectangle("Blue", 10, 5);
    console.log(rectangle.displayColor());
    console.log(`Rectangle area: ${rectangle.calculateArea()}`);
    console.log(`Rectangle perimeter: ${rectangle.calculatePerimeter()}`);
    
    // Generic class inheritance
    const userCollection = new SearchableCollection<User>();
    userCollection.add(user);
    userCollection.add(admin);
    userCollection.add(new User(3, "Alice Johnson", "alice@example.com"));
    
    const foundUsers = userCollection.search(u => u.name.includes("John"));
    foundUsers.forEach(u => console.log(`Found: ${u.name}`));
  }
  
  // Run the demo
  runDemo();
  
  
  // --- OUTPUT ---
  /*
Here's how to run it:

Create a new folder and save the code as inheritance-demo.ts
Install TypeScript if you don't have it: npm install -g typescript
Compile and run: tsc inheritance-demo.ts && node inheritance-demo.js
  */