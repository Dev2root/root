import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Seed courses first
    const courses = [
      { name: "Computer Science" },
      { name: "Electrical Engineering" },
      { name: "Business Administration" },
      { name: "Civil Engineering" },
      { name: "Data Science" }
    ];

    for (const course of courses) {
      // Check if course already exists
      const existingCourse = await db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.name, course.name)
      });

      if (!existingCourse) {
        await db.insert(schema.courses).values(course);
      }
    }

    console.log("Courses seeded successfully");

    // Seed students data
    const students = [
      {
        studentId: "20210001",
        fullName: "John Doe",
        email: "john.doe@example.com",
        courseId: 1, // Computer Science
        yearLevel: "4th Year",
        status: "Active",
      },
      {
        studentId: "20210002",
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        courseId: 2, // Electrical Engineering
        yearLevel: "3rd Year",
        status: "Active",
      },
      {
        studentId: "20210003",
        fullName: "Robert Johnson",
        email: "robert.j@example.com",
        courseId: 3, // Business Administration
        yearLevel: "2nd Year",
        status: "Inactive",
      },
      {
        studentId: "20210004",
        fullName: "Maria Parker",
        email: "maria.p@example.com",
        courseId: 4, // Civil Engineering
        yearLevel: "4th Year",
        status: "Graduated",
      },
      {
        studentId: "20210005",
        fullName: "Michael Chen",
        email: "michael.c@example.com",
        courseId: 5, // Data Science
        yearLevel: "1st Year",
        status: "Active",
      }
    ];

    for (const student of students) {
      // Check if student already exists by studentId
      const existingStudent = await db.query.students.findFirst({
        where: (students, { eq }) => eq(students.studentId, student.studentId)
      });

      if (!existingStudent) {
        await db.insert(schema.students).values(student);
      }
    }

    console.log("Students seeded successfully");
  }
  catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
