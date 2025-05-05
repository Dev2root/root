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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Search, Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AvatarName } from "@/components/ui/avatar-name";
import { StudentWithCourse } from "@/lib/types";

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  
  // Fetch students
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['/api/students', searchQuery],
    queryFn: () => 
      fetch(`/api/students?search=${searchQuery}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch students');
          return res.json();
        })
  });

  const students = studentsData?.data || [];
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Render loading state
  if (isLoadingStudents) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
          <CardContent className="pt-6">
            <p>Loading attendance records...</p>
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
            <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">Attendance</h2>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full sm:w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Attendance table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
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
                      <TableCell>
                        <Select defaultValue="present">
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">
                              <div className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                Present
                              </div>
                            </SelectItem>
                            <SelectItem value="absent">
                              <div className="flex items-center">
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Absent
                              </div>
                            </SelectItem>
                            <SelectItem value="late">
                              <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-yellow-500" />
                                Late
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Save
                        </Button>
                      </TableCell>
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