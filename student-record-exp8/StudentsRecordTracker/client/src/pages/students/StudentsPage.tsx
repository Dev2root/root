import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { AvatarName } from "@/components/ui/avatar-name";
import { StatusBadge } from "@/components/ui/status-badge";
import { Edit, Trash2, Eye, Search, Plus, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import AddStudentDialog from "./AddStudentDialog";
import EditStudentDialog from "./EditStudentDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { StudentWithCourse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function StudentsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for pagination, sorting, filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "studentId",
    direction: "asc" as "asc" | "desc"
  });
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithCourse | null>(null);
  
  // Fetch students with sorting, filtering and pagination
  const { data: studentsData, isLoading } = useQuery({
    queryKey: [
      '/api/students', 
      currentPage, 
      pageSize, 
      searchQuery, 
      filterOption, 
      sortConfig.key, 
      sortConfig.direction
    ],
    queryFn: () => 
      fetch(`/api/students?page=${currentPage}&limit=${pageSize}&search=${searchQuery}&status=${filterOption}&sortBy=${sortConfig.key}&sortDir=${sortConfig.direction}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch students');
          return res.json();
        })
  });

  // For courses dropdown in forms
  const { data: courses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => 
      fetch('/api/courses')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch courses');
          return res.json();
        })
  });
  
  // Data computations
  const students = studentsData?.data || [];
  const totalRecords = studentsData?.pagination?.total || 0;
  const totalPages = studentsData?.pagination?.totalPages || 1;

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilter = (value: string) => {
    setFilterOption(value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleSortBy = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const openEditDialog = (student: StudentWithCourse) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (student: StudentWithCourse) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Student added successfully",
      variant: "default"
    });
    queryClient.invalidateQueries({ queryKey: ['/api/students'] });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Student updated successfully",
      variant: "default"
    });
    queryClient.invalidateQueries({ queryKey: ['/api/students'] });
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Student deleted successfully",
      variant: "default"
    });
    queryClient.invalidateQueries({ queryKey: ['/api/students'] });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
          <CardContent className="pt-6">
            <p>Loading student records...</p>
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
            <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">Student Records</h2>
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
                value={filterOption}
                onValueChange={handleFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortBy("studentId")}
                  >
                    <div className="flex items-center">
                      ID
                      {getSortIcon("studentId")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortBy("fullName")}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon("fullName")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortBy("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {getSortIcon("email")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortBy("course")}
                  >
                    <div className="flex items-center">
                      Course
                      {getSortIcon("course")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortBy("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
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
                  students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <AvatarName 
                          name={student.fullName} 
                          subtitle={student.yearLevel} 
                        />
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <StatusBadge status={student.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-primary hover:text-primary-dark hover:bg-primary-light/20"
                            onClick={() => openEditDialog(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/20"
                            onClick={() => openDeleteDialog(student)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {students.length > 0 && (
            <div className="px-5 py-5 border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span> of{" "}
                <span className="font-medium">{totalRecords}</span> results
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="rounded-l-md"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant={currentPage === totalPages ? "outline" : "default"}
                  className="rounded-r-md"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Student FAB */}
      <Button 
        className="fab bg-secondary text-secondary-foreground hover:bg-secondary-dark rounded-full w-14 h-14 elevation-8 p-0"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Dialogs */}
      <AddStudentDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        courses={courses || []}
      />

      {selectedStudent && (
        <>
          <EditStudentDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={handleEditSuccess}
            student={selectedStudent}
            courses={courses || []}
          />

          <DeleteConfirmDialog 
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteSuccess}
            studentId={selectedStudent.id}
            studentName={selectedStudent.fullName}
          />
        </>
      )}
    </div>
  );
}
