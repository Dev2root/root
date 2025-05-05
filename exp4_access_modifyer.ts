// TypeScript Access Modifiers Example
// This example demonstrates all access modifiers in TypeScript

// Main class demonstrating access modifiers
class Person {
    // Public - accessible from anywhere
    public name: string;
    
    // Private - accessible only within this class
    private ssn: string;
    
    // Protected - accessible within this class and subclasses
    protected age: number;
    
    // Readonly - can only be assigned during initialization
    readonly birthDate: Date;
    
    // Static - belongs to the class, not instances
    static species: string = "Homo Sapiens";
    
    // Constructor with parameter properties
    constructor(
      name: string,
      ssn: string,
      age: number,
      birthDate: Date,
      // Parameter property - shorthand for declaring and initializing
      public email: string,
      private password: string,
      protected phoneNumber: string
    ) {
      this.name = name;
      this.ssn = ssn;
      this.age = age;
      this.birthDate = birthDate;
      // No need to assign parameter properties as they're automatically assigned
    }
    
    // Public method - accessible from anywhere
    public getDetails(): string {
      return `${this.name}, ${this.age} years old`;
    }
    
    // Private method - accessible only within this class
    private getSSN(): string {
      return `SSN: ${this.ssn}`;
    }
    
    // Protected method - accessible within this class and subclasses
    protected getContactInfo(): string {
      return `Email: ${this.email}, Phone: ${this.phoneNumber}`;
    }
    
    // Method that uses private members internally
    public verifyIdentity(inputSSN: string): boolean {
      // Using private method and property
      return inputSSN === this.ssn;
    }
    
    // Static method - called on the class itself, not instances
    static getSpecies(): string {
      return Person.species;
    }
  }
  
  // Child class to demonstrate inheritance and access modifiers
  class Employee extends Person {
    // Private property in subclass
    private employeeId: string;
    
    // Protected property in subclass
    protected department: string;
    
    constructor(
      name: string,
      ssn: string,
      age: number,
      birthDate: Date,
      email: string,
      password: string,
      phoneNumber: string,
      employeeId: string,
      department: string,
      // Public parameter property
      public position: string,
      // Private parameter property
      private salary: number
    ) {
      // Call parent constructor
      super(name, ssn, age, birthDate, email, password, phoneNumber);
      this.employeeId = employeeId;
      this.department = department;
    }
    
    // Method that demonstrates access to inherited members
    public getEmployeeInfo(): string {
      // Can access public and protected members from the parent class
      // Cannot access private members from the parent class
      return `
        Employee: ${this.name}
        Age: ${this.age}
        Department: ${this.department}
        Position: ${this.position}
        Contact: ${this.getContactInfo()}
      `;
    }
    
    // Method that attempts to access various members
    public accessTest(): void {
      // ✓ Public from parent - accessible
      console.log(this.name);
      
      // ✓ Protected from parent - accessible
      console.log(this.age);
      
      // ✗ Private from parent - NOT accessible
      // console.log(this.ssn); // This would cause a compilation error
      
      // ✓ Public method from parent - accessible
      console.log(this.getDetails());
      
      // ✓ Protected method from parent - accessible
      console.log(this.getContactInfo());
      
      // ✗ Private method from parent - NOT accessible
      // console.log(this.getSSN()); // This would cause a compilation error
    }
    
    // Override a protected method from the parent class
    protected override getContactInfo(): string {
      return `${super.getContactInfo()}, Employee ID: ${this.employeeId}`;
    }
  }
  
  // Class to demonstrate private constructor and static factory method pattern
  class Configuration {
    private static instance: Configuration | null = null;
    private settings: Map<string, any>;
    
    // Private constructor - prevents direct instantiation with 'new'
    private constructor() {
      this.settings = new Map<string, any>();
      this.settings.set("theme", "dark");
      this.settings.set("notifications", true);
    }
    
    // Static factory method - the only way to get an instance
    public static getInstance(): Configuration {
      if (!Configuration.instance) {
        Configuration.instance = new Configuration();
      }
      return Configuration.instance;
    }
    
    public getSetting(key: string): any {
      return this.settings.get(key);
    }
    
    public setSetting(key: string, value: any): void {
      this.settings.set(key, value);
    }
  }
  
  // Demonstration using all the access modifiers
  function demoAccessModifiers(): void {
    // Creating a person instance
    const person = new Person(
      "John Doe",
      "123-45-6789",
      30,
      new Date("1993-05-15"),
      "john@example.com",
      "securepass",
      "555-123-4567"
    );
    
    // Accessing public members
    console.log(person.name); // ✓ Accessible
    console.log(person.email); // ✓ Accessible (public parameter property)
    console.log(person.getDetails()); // ✓ Accessible
    
    // Accessing readonly members
    console.log(person.birthDate); // ✓ Accessible, but can't be changed
    // person.birthDate = new Date(); // ✗ Error: Cannot assign to 'birthDate' because it is a read-only property
    
    // Accessing private members
    // console.log(person.ssn); // ✗ Property 'ssn' is private and only accessible within class 'Person'
    // console.log(person.password); // ✗ Property 'password' is private and only accessible within class 'Person'
    // console.log(person.getSSN()); // ✗ Property 'getSSN' is private and only accessible within class 'Person'
    
    // Accessing protected members
    // console.log(person.age); // ✗ Property 'age' is protected and only accessible within class 'Person' and its subclasses
    // console.log(person.phoneNumber); // ✗ Property 'phoneNumber' is protected and only accessible within class 'Person' and its subclasses
    // console.log(person.getContactInfo()); // ✗ Property 'getContactInfo' is protected and only accessible within class 'Person' and its subclasses
    
    // Accessing static members
    console.log(Person.species); // ✓ Accessible
    console.log(Person.getSpecies()); // ✓ Accessible
    
    // Creating an employee instance
    const employee = new Employee(
      "Jane Smith",
      "987-65-4321",
      28,
      new Date("1995-10-20"),
      "jane@company.com",
      "employeepass",
      "555-987-6543",
      "EMP-12345",
      "Engineering",
      "Software Developer",
      85000
    );
    
    // Accessing public members
    console.log(employee.name); // ✓ Accessible (inherited public)
    console.log(employee.position); // ✓ Accessible (own public)
    console.log(employee.getEmployeeInfo()); // ✓ Accessible
    
    // Accessing private members
    // console.log(employee.employeeId); // ✗ Property 'employeeId' is private and only accessible within class 'Employee'
    // console.log(employee.salary); // ✗ Property 'salary' is private and only accessible within class 'Employee'
    
    // Accessing protected members
    // console.log(employee.department); // ✗ Property 'department' is protected and only accessible within class 'Employee' and its subclasses
    
    // Using singleton with private constructor
    // const config = new Configuration(); // ✗ Constructor of class 'Configuration' is private and only accessible within the class declaration
    const config = Configuration.getInstance(); // ✓ Accessible
    console.log(config.getSetting("theme")); // "dark"
    config.setSetting("theme", "light");
    console.log(config.getSetting("theme")); // "light"
  }
  
  // Run the demo
  demoAccessModifiers();
  
  /*
  HOW TO RUN THIS CODE:
  
  For Ubuntu System:
  
  1. Make sure you have Node.js and TypeScript installed:
     $ sudo apt update
     $ sudo apt install nodejs npm
     $ sudo npm install -g typescript
  
  2. Save this file as access-modifiers.ts
  
  3. Compile the TypeScript file:
     $ tsc access-modifiers.ts
  
  4. Run the compiled JavaScript:
     $ node access-modifiers.js
  
  Alternative method using ts-node (for direct execution):
  1. Install ts-node:
     $ sudo npm install -g ts-node
  
  2. Run directly:
     $ ts-node access-modifiers.ts
  */