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
import { Search, Plus, Users } from "lucide-react";
import { Course } from "@shared/schema";
import { AddCourseDialog } from "./AddCourseDialog";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: () => 
      fetch('/api/courses')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch courses');
          return res.json();
        })
  });

  // Filter courses based on search query
  const filteredCourses = courses?.filter((course: Course) => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
          <CardContent className="pt-6">
            <p>Loading courses...</p>
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
            <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">Courses</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {/* Courses table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course: Course) => (
                    <TableRow key={course.id} className="hover:bg-muted/50">
                      <TableCell>{course.id}</TableCell>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>View Students</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Course FAB */}
      <Button 
        className="fab bg-secondary text-secondary-foreground hover:bg-secondary-dark rounded-full w-14 h-14 elevation-8 p-0"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Course Dialog */}
      <AddCourseDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
}