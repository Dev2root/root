import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, like, desc, asc } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Student Management
  const apiPrefix = "/api";

  // Get all courses
  app.get(`${apiPrefix}/courses`, async (req, res) => {
    try {
      const courses = await db.query.courses.findMany();
      return res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get course by ID
  app.get(`${apiPrefix}/courses/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const course = await db.query.courses.findFirst({
        where: eq(schema.courses.id, parseInt(id)),
        with: {
          students: true
        }
      });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.json(course);
    } catch (error) {
      console.error(`Error fetching course ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Create new course
  app.post(`${apiPrefix}/courses`, async (req, res) => {
    try {
      const validatedData = schema.courseInsertSchema.parse(req.body);
      
      // Check if course name already exists
      const existingCourse = await db.query.courses.findFirst({
        where: eq(schema.courses.name, validatedData.name)
      });

      if (existingCourse) {
        return res.status(400).json({ message: "Course name already exists" });
      }

      const [newCourse] = await db.insert(schema.courses)
        .values(validatedData)
        .returning();

      return res.status(201).json(newCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating course:", error);
      return res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Get all students with pagination, sorting and filtering
  app.get(`${apiPrefix}/students`, async (req, res) => {
    try {
      const { 
        page = "1", 
        limit = "10", 
        search = "", 
        status = "",
        sortBy = "studentId",
        sortDir = "asc"
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build query with filters
      let query = db.select({
        id: schema.students.id,
        studentId: schema.students.studentId,
        fullName: schema.students.fullName,
        email: schema.students.email,
        yearLevel: schema.students.yearLevel,
        status: schema.students.status,
        course: schema.courses.name,
        courseId: schema.courses.id
      })
      .from(schema.students)
      .leftJoin(schema.courses, eq(schema.students.courseId, schema.courses.id));

      // Apply search filter if provided
      if (search) {
        const searchLike = `%${search}%`;
        query = query.where(
          like(schema.students.fullName, searchLike)
        );
      }

      // Apply status filter if provided
      if (status && status !== 'all') {
        query = query.where(eq(schema.students.status, status as string));
      }

      // Apply sorting
      if (sortBy && sortDir) {
        const direction = sortDir === 'desc' ? desc : asc;
        
        switch (sortBy) {
          case 'studentId':
            query = query.orderBy(direction(schema.students.studentId));
            break;
          case 'fullName':
            query = query.orderBy(direction(schema.students.fullName));
            break;
          case 'email':
            query = query.orderBy(direction(schema.students.email));
            break;
          case 'course':
            query = query.orderBy(direction(schema.courses.name));
            break;
          case 'status':
            query = query.orderBy(direction(schema.students.status));
            break;
          default:
            query = query.orderBy(direction(schema.students.studentId));
        }
      }

      // Count total records for pagination
      const countQuery = await db.select({ count: schema.students.id })
        .from(schema.students)
        .where(
          search ? like(schema.students.fullName, `%${search}%`) : undefined
        )
        .where(
          status && status !== 'all' ? eq(schema.students.status, status as string) : undefined
        );
        
      const totalRecords = countQuery.length;

      // Execute query with pagination
      const students = await query.limit(limitNum).offset(offset);

      return res.json({
        data: students,
        pagination: {
          total: totalRecords,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalRecords / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get student by ID
  app.get(`${apiPrefix}/students/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const student = await db.query.students.findFirst({
        where: eq(schema.students.id, parseInt(id)),
        with: {
          course: true
        }
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json(student);
    } catch (error) {
      console.error(`Error fetching student ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Create new student
  app.post(`${apiPrefix}/students`, async (req, res) => {
    try {
      const validatedData = schema.insertStudentSchema.parse(req.body);
      
      // Check if student ID already exists
      const existingStudent = await db.query.students.findFirst({
        where: eq(schema.students.studentId, validatedData.studentId)
      });

      if (existingStudent) {
        return res.status(400).json({ message: "Student ID already exists" });
      }

      const [newStudent] = await db.insert(schema.students)
        .values(validatedData)
        .returning();

      return res.status(201).json(newStudent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating student:", error);
      return res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Update student
  app.put(`${apiPrefix}/students/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = schema.updateStudentSchema.parse(req.body);

      // Check if student exists
      const existingStudent = await db.query.students.findFirst({
        where: eq(schema.students.id, parseInt(id))
      });

      if (!existingStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Check if updating to an existing student ID (that's not the current student's)
      if (validatedData.studentId) {
        const duplicateId = await db.query.students.findFirst({
          where: (students, { eq, and, ne }) => and(
            eq(students.studentId, validatedData.studentId),
            ne(students.id, parseInt(id))
          )
        });

        if (duplicateId) {
          return res.status(400).json({ message: "Student ID already exists" });
        }
      }

      const [updatedStudent] = await db.update(schema.students)
        .set(validatedData)
        .where(eq(schema.students.id, parseInt(id)))
        .returning();

      return res.json(updatedStudent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error(`Error updating student ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update student" });
    }
  });

  // Delete student
  app.delete(`${apiPrefix}/students/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if student exists
      const existingStudent = await db.query.students.findFirst({
        where: eq(schema.students.id, parseInt(id))
      });

      if (!existingStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      await db.delete(schema.students)
        .where(eq(schema.students.id, parseInt(id)));

      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error(`Error deleting student ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete student" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
