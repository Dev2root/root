// Project Structure:
//
// students-app/
// ├── src/
// │   ├── app/
// │   │   ├── models/
// │   │   │   └── student.model.ts
// │   │   ├── components/
// │   │   │   ├── student-list/
// │   │   │   │   ├── student-list.component.ts
// │   │   │   │   ├── student-list.component.html
// │   │   │   │   └── student-list.component.css
// │   │   │   ├── student-form/
// │   │   │   │   ├── student-form.component.ts
// │   │   │   │   ├── student-form.component.html
// │   │   │   │   └── student-form.component.css
// │   │   ├── services/
// │   │   │   └── student.service.ts
// │   │   ├── app.component.ts
// │   │   ├── app.component.html
// │   │   ├── app.component.css
// │   │   └── app.module.ts
// │   ├── index.html
// │   └── styles.css
// ├── angular.json
// ├── package.json
// └── tsconfig.json

// src/app/models/student.model.ts

// src/app/models/student.model.ts

export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  grade: number;
}


// src/app/services/student.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Mock database
  private students: Student[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Computer Science', grade: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Mathematics', grade: 92 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', course: 'Physics', grade: 78 }
  ];

  private studentsSubject = new BehaviorSubject<Student[]>(this.students);

  constructor() { }

  getStudents(): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  getStudentById(id: number): Student | undefined {
    return this.students.find(student => student.id === id);
  }

  addStudent(student: Omit<Student, 'id'>): void {
    const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    const newStudent = { ...student, id: newId };
    this.students = [...this.students, newStudent];
    this.studentsSubject.next(this.students);
  }

  updateStudent(student: Student): void {
    this.students = this.students.map(s => s.id === student.id ? student : s);
    this.studentsSubject.next(this.students);
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter(student => student.id !== id);
    this.studentsSubject.next(this.students);
  }
}



// src/app/components/student-list/student-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  isEditing = false;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
    });
  }

  addNewStudent(): void {
    this.selectedStudent = null;
    this.isEditing = true;
  }

  editStudent(student: Student): void {
    this.selectedStudent = { ...student };
    this.isEditing = true;
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id);
    }
  }

  onStudentFormClose(): void {
    this.isEditing = false;
    this.selectedStudent = null;
  }

  onStudentSubmit(student: Student): void {
    if (student.id) {
      this.studentService.updateStudent(student);
    } else {
      this.studentService.addStudent(student);
    }
    this.isEditing = false;
    this.selectedStudent = null;
  }
}



<!-- src/app/components/student-list/student-list.component.html -->

<div class="container">
  <h2>Students Record</h2>
  
  <button class="add-btn" (click)="addNewStudent()">Add New Student</button>
  
  <div class="table-container">
    <table *ngIf="students.length > 0; else noStudents">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Course</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let student of students">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.course }}</td>
          <td>{{ student.grade }}</td>
          <td class="actions">
            <button class="edit-btn" (click)="editStudent(student)">Edit</button>
            <button class="delete-btn" (click)="deleteStudent(student.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <ng-template #noStudents>
      <p class="no-students">No students found. Please add a student.</p>
    </ng-template>
  </div>
</div>

<div class="modal-overlay" *ngIf="isEditing">
  <app-student-form 
    [student]="selectedStudent" 
    (formClose)="onStudentFormClose()" 
    (formSubmit)="onStudentSubmit($event)">
  </app-student-form>
</div>



  /* src/app/components/student-list/student-list.component.css */

.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:hover {
  background-color: #f5f5f5;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover {
  background-color: #0b7dda;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #da190b;
}

.no-students {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}


// src/app/components/student-form/student-form.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<Student>();
  
  studentForm!: FormGroup;
  formTitle: string = 'Add Student';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    
    if (this.student) {
      this.formTitle = 'Edit Student';
      this.studentForm.patchValue(this.student);
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      id: [this.student ? this.student.id : null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required],
      grade: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value as Student;
      this.formSubmit.emit(studentData);
    } else {
      this.markFormGroupTouched(this.studentForm);
    }
  }

  onCancel(): void {
    this.formClose.emit();
  }

  // Helper method to trigger validation on all form fields
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Helper getters for form controls
  get nameControl() { return this.studentForm.get('name'); }
  get emailControl() { return this.studentForm.get('email'); }
  get courseControl() { return this.studentForm.get('course'); }
  get gradeControl() { return this.studentForm.get('grade'); }
}



<!-- src/app/components/student-form/student-form.component.html -->

<div class="form-container">
  <h3>{{ formTitle }}</h3>
  
  <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="name">Name</label>
      <input 
        type="text" 
        id="name" 
        formControlName="name" 
        placeholder="Student name"
      >
      <div class="error-message" *ngIf="nameControl?.invalid && nameControl?.touched">
        <span *ngIf="nameControl?.errors?.['required']">Name is required</span>
        <span *ngIf="nameControl?.errors?.['minlength']">Name must be at least 3 characters</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        formControlName="email" 
        placeholder="student@example.com"
      >
      <div class="error-message" *ngIf="emailControl?.invalid && emailControl?.touched">
        <span *ngIf="emailControl?.errors?.['required']">Email is required</span>
        <span *ngIf="emailControl?.errors?.['email']">Please enter a valid email</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="course">Course</label>
      <input 
        type="text" 
        id="course" 
        formControlName="course" 
        placeholder="Course name"
      >
      <div class="error-message" *ngIf="courseControl?.invalid && courseControl?.touched">
        <span *ngIf="courseControl?.errors?.['required']">Course is required</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="grade">Grade</label>
      <input 
        type="number" 
        id="grade" 
        formControlName="grade" 
        placeholder="0-100"
        min="0"
        max="100"
      >
      <div class="error-message" *ngIf="gradeControl?.invalid && gradeControl?.touched">
        <span *ngIf="gradeControl?.errors?.['required']">Grade is required</span>
        <span *ngIf="gradeControl?.errors?.['min'] || gradeControl?.errors?.['max']">
          Grade must be between 0 and 100
        </span>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" class="cancel-btn" (click)="onCancel()">Cancel</button>
      <button type="submit" class="submit-btn" [disabled]="studentForm.invalid">
        {{ student ? 'Update' : 'Add' }} Student
      </button>
    </div>
  </form>
</div>



/* src/app/components/student-form/student-form.component.css */

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}


// src/app/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Students Record Application';
}


<!-- src/app/app.component.html -->

<div class="app-container">
  <header>
    <h1>{{ title }}</h1>
  </header>
  
  <main>
    <app-student-list></app-student-list>
  </main>
  
  <footer>
    <p>&copy; 2025 Students Record App</p>
  </footer>
</div>



/* src/app/app.component.css */

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #3f51b5;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 24px;
}

main {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 14px;
}



// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }




/* src/styles.css */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Basic utility classes */
.text-center {
  text-align: center;
}

.mt-1 {
  margin-top: 10px;
}

.mt-2 {
  margin-top: 20px;
}

.mb-1 {
  margin-bottom: 10px;
}

.mb-2 {
  margin-bottom: 20px;
}



<!-- src/index.html -->

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Students Record Application</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>



  // package.json 

  {
  "name": "students-record-app",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.2"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.2.2"
  }
}




...

  // setup instructions  

  # Students Record Application - Setup Instructions

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Angular CLI

## Installation Steps for Ubuntu

### 1. Install Node.js and npm
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node -v
npm -v
```

### 2. Install Angular CLI
```bash
# Install Angular CLI globally
sudo npm install -g @angular/cli

# Verify installation
ng version
```

### 3. Create a new Angular project
```bash
# Create a new project
ng new students-record-app --routing=false --style=css

# Navigate to the project directory
cd students-record-app
```

# Students Record Application - Setup Instructions

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Angular CLI

## Installation Steps for Ubuntu

### 1. Install Node.js and npm
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node -v
npm -v
```

### 2. Install Angular CLI
```bash
# Install Angular CLI globally
sudo npm install -g @angular/cli

# Verify installation
ng version
```

### 3. Create a new Angular project
```bash
# Create a new project
ng new students-record-app --routing=false --style=css

# Navigate to the project directory
cd students-record-app
```

### 4. Replace or Create Project Files
Copy all the provided code files into their respective locations in the project structure:

1. Create directories if they don't exist:
```bash
mkdir -p src/app/models
mkdir -p src/app/services
mkdir -p src/app/components/student-list
mkdir -p src/app/components/student-form

2. Create all files with the provided code:
```bash
# Create model files
cat > src/app/models/student.model.ts << 'EOF
```

### 5. Run the Application
```bash
# Start the development server
ng serve

# The app will be available at http://localhost:4200/
```

You can now access the Students Record application by opening a web browser and navigating to `http://localhost:4200/`.

## Application Features

1. **View Students**: The homepage displays a list of all students with their details.
2. **Add Student**: Click the "Add New Student" button to create a new student record.
3. **Edit Student**: Click the "Edit" button next to a student to modify their information.
4. **Delete Student**: Click the "Delete" button to remove a student from the records.

## Data Persistence

Note that this is a simple application that stores data in memory. Data will be reset when you refresh the page or restart the application. For a production app, you would want to connect to a backend API or database.

## Additional Customization

You can further customize this application by:

1. Adding authentication
2. Connecting to a real backend API
3. Adding more fields to the student model
4. Implementing sorting and filtering
5. Adding pagination for larger data sets

## Troubleshooting

If you encounter any issues during installation or setup:

1. **Node.js version issues**: Make sure you're using a compatible version of Node.js (v14+)
2. **Angular CLI installation fails**: Try running with sudo (`sudo npm install -g @angular/cli`)
3. **Dependency issues**: Run `npm install` to ensure all dependencies are correctly installed
4. **Port already in use**: Use `ng serve --port=4201` to run on a different port'
export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  grade: number;
}
EOF

# Create service files
cat > src/app/services/student.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Mock database
  private students: Student[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Computer Science', grade: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Mathematics', grade: 92 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', course: 'Physics', grade: 78 }
  ];

  private studentsSubject = new BehaviorSubject<Student[]>(this.students);

  constructor() { }

  getStudents(): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  getStudentById(id: number): Student | undefined {
    return this.students.find(student => student.id === id);
  }

  addStudent(student: Omit<Student, 'id'>): void {
    const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    const newStudent = { ...student, id: newId };
    this.students = [...this.students, newStudent];
    this.studentsSubject.next(this.students);
  }

  updateStudent(student: Student): void {
    this.students = this.students.map(s => s.id === student.id ? student : s);
    this.studentsSubject.next(this.students);
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter(student => student.id !== id);
    this.studentsSubject.next(this.students);
  }
}
EOF

# Create student-list component files
cat > src/app/components/student-list/student-list.component.ts << 'EOF'
import { Component, OnInit } from '@angular/core';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  isEditing = false;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
    });
  }

  addNewStudent(): void {
    this.selectedStudent = null;
    this.isEditing = true;
  }

  editStudent(student: Student): void {
    this.selectedStudent = { ...student };
    this.isEditing = true;
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id);
    }
  }

  onStudentFormClose(): void {
    this.isEditing = false;
    this.selectedStudent = null;
  }

  onStudentSubmit(student: Student): void {
    if (student.id) {
      this.studentService.updateStudent(student);
    } else {
      this.studentService.addStudent(student);
    }
    this.isEditing = false;
    this.selectedStudent = null;
  }
}
EOF

cat > src/app/components/student-list/student-list.component.html << 'EOF'
<div class="container">
  <h2>Students Record</h2>
  
  <button class="add-btn" (click)="addNewStudent()">Add New Student</button>
  
  <div class="table-container">
    <table *ngIf="students.length > 0; else noStudents">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Course</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let student of students">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.course }}</td>
          <td>{{ student.grade }}</td>
          <td class="actions">
            <button class="edit-btn" (click)="editStudent(student)">Edit</button>
            <button class="delete-btn" (click)="deleteStudent(student.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <ng-template #noStudents>
      <p class="no-students">No students found. Please add a student.</p>
    </ng-template>
  </div>
</div>

<div class="modal-overlay" *ngIf="isEditing">
  <app-student-form 
    [student]="selectedStudent" 
    (formClose)="onStudentFormClose()" 
    (formSubmit)="onStudentSubmit($event)">
  </app-student-form>
</div>
EOF

cat > src/app/components/student-list/student-list.component.css << 'EOF'
.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #45a049;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:hover {
  background-color: #f5f5f5;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover {
  background-color: #0b7dda;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #da190b;
}

.no-students {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
EOF

# Create student-form component files
cat > src/app/components/student-form/student-form.component.ts << 'EOF'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<Student>();
  
  studentForm!: FormGroup;
  formTitle: string = 'Add Student';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    
    if (this.student) {
      this.formTitle = 'Edit Student';
      this.studentForm.patchValue(this.student);
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      id: [this.student ? this.student.id : null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required],
      grade: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value as Student;
      this.formSubmit.emit(studentData);
    } else {
      this.markFormGroupTouched(this.studentForm);
    }
  }

  onCancel(): void {
    this.formClose.emit();
  }

  // Helper method to trigger validation on all form fields
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Helper getters for form controls
  get nameControl() { return this.studentForm.get('name'); }
  get emailControl() { return this.studentForm.get('email'); }
  get courseControl() { return this.studentForm.get('course'); }
  get gradeControl() { return this.studentForm.get('grade'); }
}
EOF

cat > src/app/components/student-form/student-form.component.html << 'EOF'
<div class="form-container">
  <h3>{{ formTitle }}</h3>
  
  <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="name">Name</label>
      <input 
        type="text" 
        id="name" 
        formControlName="name" 
        placeholder="Student name"
      >
      <div class="error-message" *ngIf="nameControl?.invalid && nameControl?.touched">
        <span *ngIf="nameControl?.errors?.['required']">Name is required</span>
        <span *ngIf="nameControl?.errors?.['minlength']">Name must be at least 3 characters</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        formControlName="email" 
        placeholder="student@example.com"
      >
      <div class="error-message" *ngIf="emailControl?.invalid && emailControl?.touched">
        <span *ngIf="emailControl?.errors?.['required']">Email is required</span>
        <span *ngIf="emailControl?.errors?.['email']">Please enter a valid email</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="course">Course</label>
      <input 
        type="text" 
        id="course" 
        formControlName="course" 
        placeholder="Course name"
      >
      <div class="error-message" *ngIf="courseControl?.invalid && courseControl?.touched">
        <span *ngIf="courseControl?.errors?.['required']">Course is required</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="grade">Grade</label>
      <input 
        type="number" 
        id="grade" 
        formControlName="grade" 
        placeholder="0-100"
        min="0"
        max="100"
      >
      <div class="error-message" *ngIf="gradeControl?.invalid && gradeControl?.touched">
        <span *ngIf="gradeControl?.errors?.['required']">Grade is required</span>
        <span *ngIf="gradeControl?.errors?.['min'] || gradeControl?.errors?.['max']">
          Grade must be between 0 and 100
        </span>
      </div>
    </div>
    
    <div class="button-group">
      <button type="button" class="cancel-btn" (click)="onCancel()">Cancel</button>
      <button type="submit" class="submit-btn" [disabled]="studentForm.invalid">
        {{ student ? 'Update' : 'Add' }} Student
      </button>
    </div>
  </form>
</div>
EOF

cat > src/app/components/student-form/student-form.component.css << 'EOF'
.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
EOF

# Create app component files
cat > src/app/app.component.ts << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Students Record Application';
}
EOF

cat > src/app/app.component.html << 'EOF'
<div class="app-container">
  <header>
    <h1>{{ title }}</h1>
  </header>
  
  <main>
    <app-student-list></app-student-list>
  </main>
  
  <footer>
    <p>&copy; 2025 Students Record App</p>
  </footer>
</div>
EOF

cat > src/app/app.component.css << 'EOF'
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #3f51b5;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 24px;
}

main {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 14px;
}
EOF

# Create app module file
cat > src/app/app.module.ts << 'EOF'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
EOF

# Update global styles
cat > src/styles.css << 'EOF'
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Basic utility classes */
.text-center {
  text-align: center;
}

.mt-1 {
  margin-top: 10px;
}

.mt-2 {
  margin-top: 20px;
}

.mb-1 {
  margin-bottom: 10px;
}

.mb-2 {
  margin-bottom: 20px;
}
EOF




