// Types for the Student Record Management System
import { Student, Course } from "@shared/schema";

// Type for student with course name (for display)
export interface StudentWithCourse extends Omit<Student, 'course'> {
  course: string | null;
}

// Re-export shared types for convenience
export type { Student, Course };
