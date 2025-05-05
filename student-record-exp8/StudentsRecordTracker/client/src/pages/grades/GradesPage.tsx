import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { AvatarName } from "@/components/ui/avatar-name";
import { Course, StudentWithCourse } from "@/lib/types";

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  // Fetch students
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['/api/students', searchQuery, courseFilter],
    queryFn: () => 
      fetch(`/api/students?search=${searchQuery}${courseFilter !== 'all' ? `&courseId=${courseFilter}` : ''}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch students');
          return res.json();
        })
  });

  // Fetch courses for filter
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => 
      fetch('/api/courses')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch courses');
          return res.json();
        })
  });

  const students = studentsData?.data || [];
  const isLoading = isLoadingStudents || isLoadingCourses;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
          <CardContent className="pt-6">
            <p>Loading student grades...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">Student Grades</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select
                value={courseFilter}
                onValueChange={setCourseFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses?.map((course: Course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grades table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Midterm Grade</TableHead>
                  <TableHead>Final Grade</TableHead>
                  <TableHead>Average</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student: StudentWithCourse) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <AvatarName 
                          name={student.fullName} 
                          subtitle={student.yearLevel} 
                        />
                      </TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}