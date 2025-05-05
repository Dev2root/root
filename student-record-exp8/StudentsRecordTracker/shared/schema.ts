import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Course table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Student table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  yearLevel: varchar("year_level", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
});

// Relations setup
export const coursesRelations = relations(courses, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  course: one(courses, {
    fields: [students.courseId],
    references: [courses.id],
  }),
}));

// Validation schemas for courses
export const courseInsertSchema = createInsertSchema(courses, {
  name: (schema) => schema.min(2, "Course name must be at least 2 characters"),
});

export const courseSelectSchema = createSelectSchema(courses);

// Validation schemas for students
export const insertStudentSchema = createInsertSchema(students, {
  studentId: (schema) => schema.min(4, "Student ID must be at least 4 characters"),
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  yearLevel: (schema) => schema.min(1, "Year level is required"),
  status: (schema) => schema.min(1, "Status is required"),
});

export const updateStudentSchema = createInsertSchema(students, {
  studentId: (schema) => schema.min(4, "Student ID must be at least 4 characters").optional(),
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters").optional(),
  email: (schema) => schema.email("Must provide a valid email").optional(),
  yearLevel: (schema) => schema.min(1, "Year level is required").optional(),
  status: (schema) => schema.min(1, "Status is required").optional(),
  courseId: (schema) => schema.optional(),
}).partial();

// Type definitions
export type Course = typeof courses.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type StudentWithCourse = Student & { course: string | null };
