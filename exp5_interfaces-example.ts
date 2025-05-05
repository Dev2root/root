// File: interfaces-example.ts
// TypeScript Interfaces Implementation Example

// Basic interface
interface User {
    id: number;
    name: string;
    email: string;
  }
  
  // Interface with optional properties (?)
  interface Product {
    id: number;
    name: string;
    price: number;
    description?: string; // Optional property
    category?: string;    // Optional property
  }
  
  // Interface with readonly properties
  interface Config {
    readonly apiKey: string;
    readonly baseUrl: string;
    timeout: number;      // Not readonly, can be modified
  }
  
  // Interface with methods
  interface Logger {
    log(message: string): void;
    error(message: string, code?: number): void;
    clear(): void;
  }
  
  // Interface extending another interface
  interface Employee extends User {
    employeeId: string;
    department: string;
    hireDate: Date;
  }
  
  // Interface with index signature
  interface Dictionary {
    [key: string]: any;
  }
  
  // Interface for function types
  interface MathFunc {
    (x: number, y: number): number;
  }
  
  // Implementing a basic interface
  class Customer implements User {
    id: number;
    name: string;
    email: string;
    
    constructor(id: number, name: string, email: string) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
    
    displayInfo(): string {
      return `Customer: ${this.name} (${this.email})`;
    }
  }
  
  // Implementing multiple interfaces
  class ConsoleLogger implements Logger {
    log(message: string): void {
      console.log(`LOG: ${message}`);
    }
    
    error(message: string, code?: number): void {
      if (code) {
        console.error(`ERROR [${code}]: ${message}`);
      } else {
        console.error(`ERROR: ${message}`);
      }
    }
    
    clear(): void {
      console.clear();
    }
  }
  
  // Class implementing extended interface
  class Staff implements Employee {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    department: string;
    hireDate: Date;
    
    constructor(
      id: number,
      name: string,
      email: string,
      employeeId: string,
      department: string,
      hireDate: Date
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.employeeId = employeeId;
      this.department = department;
      this.hireDate = hireDate;
    }
    
    getYearsOfService(): number {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - this.hireDate.getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      return Math.floor(diffYears);
    }
  }
  
  // Using interface for object literals
  const userSettings: Config = {
    apiKey: "abc123xyz789",
    baseUrl: "https://api.example.com",
    timeout: 30000
  };
  
  // Cannot modify readonly properties
  // userSettings.apiKey = "newKey"; // Error: Cannot assign to 'apiKey' because it is a read-only property
  
  // Using interface with optional properties
  const phone: Product = {
    id: 101,
    name: "Smartphone X",
    price: 699.99
    // description and category are optional, so we can omit them
  };
  
  const laptop: Product = {
    id: 102,
    name: "Ultrabook Pro",
    price: 1299.99,
    description: "Powerful laptop with 16GB RAM",
    category: "Electronics"
  };
  
  // Using interface with index signature
  const cache: Dictionary = {
    user123: { name: "John", role: "Admin" },
    settings: { theme: "dark", notifications: true },
    "last-login": "2023-04-15T10:30:00Z"
  };
  
  // Adding new properties dynamically
  cache["temp-data"] = { valid: true, expires: "1h" };
  
  // Using interface for function types
  const add: MathFunc = (x: number, y: number): number => x + y;
  const multiply: MathFunc = (x: number, y: number): number => x * y;
  
  // Interface for class constructor
  interface UserConstructor {
    new (id: number, name: string, email: string): User;
  }
  
  // Hybrid interfaces (combining callable with properties/methods)
  interface APIRequest {
    (endpoint: string, data: any): Promise<any>;
    baseUrl: string;
    setHeaders(headers: object): void;
    setTimeout(ms: number): void;
  }
  
  // Implementing a hybrid interface
  const createAPIRequest = (): APIRequest => {
    const request = async (endpoint: string, data: any): Promise<any> => {
      const url = `${request.baseUrl}${endpoint}`;
      console.log(`Making request to ${url} with data:`, data);
      return Promise.resolve({ success: true });
    };
    
    request.baseUrl = "https://api.example.org/";
    
    request.setHeaders = (headers: object): void => {
      console.log("Setting headers:", headers);
    };
    
    request.setTimeout = (ms: number): void => {
      console.log(`Setting timeout to ${ms}ms`);
    };
    
    return request;
  };
  
  // Generic interfaces
  interface Repository<T> {
    getById(id: number): T;
    getAll(): T[];
    create(item: T): void;
    update(id: number, item: T): void;
    delete(id: number): void;
  }
  
  // Implementing a generic interface
  class UserRepository implements Repository<User> {
    private users: User[] = [];
    
    getById(id: number): User {
      const user = this.users.find(u => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    }
    
    getAll(): User[] {
      return this.users;
    }
    
    create(user: User): void {
      if (this.users.some(u => u.id === user.id)) {
        throw new Error(`User with ID ${user.id} already exists`);
      }
      this.users.push(user);
    }
    
    update(id: number, updatedUser: User): void {
      const index = this.users.findIndex(u => u.id === id);
      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      this.users[index] = updatedUser;
    }
    
    delete(id: number): void {
      const index = this.users.findIndex(u => u.id === id);
      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      this.users.splice(index, 1);
    }
  }
  
  // Demo function using interfaces
  function demonstrateInterfaces(): void {
    // Create objects implementing interfaces
    const customer = new Customer(1, "John Doe", "john@example.com");
    console.log(customer.displayInfo());
    
    const logger = new ConsoleLogger();
    logger.log("Application started");
    logger.error("Connection failed", 404);
    
    const employee = new Staff(
      2,
      "Jane Smith",
      "jane@company.com",
      "EMP-2023-001",
      "Engineering",
      new Date("2020-03-15")
    );
    console.log(`${employee.name} has worked for ${employee.getYearsOfService()} years`);
    
    // Use function interface
    console.log(`5 + 3 = ${add(5, 3)}`);
    console.log(`5 * 3 = ${multiply(5, 3)}`);
    
    // Use hybrid interface
    const apiRequest = createAPIRequest();
    apiRequest.setHeaders({ "Content-Type": "application/json" });
    apiRequest.setTimeout(5000);
    apiRequest("/users", { name: "New User" });
    
    // Use generic interface
    const userRepo = new UserRepository();
    userRepo.create(customer);
    userRepo.create(employee);
    console.log(`Total users: ${userRepo.getAll().length}`);
  }
  
  // Run the demonstration
  demonstrateInterfaces();
  
  /*
  HOW TO RUN THIS CODE:
  
  For Ubuntu System:
  
  1. Make sure you have Node.js and TypeScript installed:
     $ sudo apt update
     $ sudo apt install nodejs npm
     $ sudo npm install -g typescript
  
  2. Save this file as interfaces-example.ts
  
  3. Compile the TypeScript file:
     $ tsc interfaces-example.ts
  
  4. Run the compiled JavaScript:
     $ node interfaces-example.js
  
  Alternative method using ts-node (for direct execution):
  1. Install ts-node:
     $ sudo npm install -g ts-node
  
  2. Run directly:
     $ ts-node interfaces-example.ts
  */