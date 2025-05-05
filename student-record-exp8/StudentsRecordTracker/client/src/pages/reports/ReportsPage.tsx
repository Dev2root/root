import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileDown, PieChart, BarChart3, UsersRound } from "lucide-react";

export default function ReportsPage() {
  // Get count of students by status
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['/api/students'],
    queryFn: () => 
      fetch('/api/students')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch students');
          return res.json();
        })
  });

  // Get courses
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
  
  // Count students by status
  const statusCounts = {
    active: students.filter((student: any) => student.status === 'Active').length,
    inactive: students.filter((student: any) => student.status === 'Inactive').length,
    graduated: students.filter((student: any) => student.status === 'Graduated').length,
  };

  // Render loading state
  if (isLoading || isLoadingCourses) {
    return (
      <div className="container mx-auto">
        <Card className="bg-white rounded-md elevation-1 p-6 mb-6">
          <CardContent className="pt-6">
            <p>Loading reports...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Student Status</span>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Overview of student status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Active</span>
                </div>
                <span className="font-medium">{statusCounts.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>Inactive</span>
                </div>
                <span className="font-medium">{statusCounts.inactive}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Graduated</span>
                </div>
                <span className="font-medium">{statusCounts.graduated}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Course Enrollment</span>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Number of students per course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses?.map((course: any) => {
                const count = students.filter((student: any) => student.courseId === course.id).length;
                const percentage = students.length ? Math.round((count / students.length) * 100) : 0;
                
                return (
                  <div key={course.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{course.name}</span>
                      <span className="text-sm text-muted-foreground">{count} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersRound className="mr-2 h-5 w-5" />
            <span>Student Population</span>
          </CardTitle>
          <CardDescription>
            A summary of all student records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1">Total Students</div>
              <div className="text-2xl font-bold">{students.length}</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1">Active Students</div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1">Graduated Students</div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.graduated}</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground mb-1">Total Courses</div>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="mr-2">
              <FileDown className="mr-2 h-4 w-4" />
              Generate Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}