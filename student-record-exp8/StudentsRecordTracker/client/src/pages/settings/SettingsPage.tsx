import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [generalSaved, setGeneralSaved] = useState(false);
  
  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated.",
    });
    setGeneralSaved(true);
    
    // Reset the saved status after a delay
    setTimeout(() => {
      setGeneralSaved(false);
    }, 3000);
  };
  
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">Settings</h2>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your school information and basic preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input id="schoolName" defaultValue="Sample University" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academicYear">Current Academic Year</Label>
                <Input id="academicYear" defaultValue="2023-2024" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="autoLogout" defaultChecked />
                <Label htmlFor="autoLogout">Auto logout after 30 minutes of inactivity</Label>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveGeneral}>
                  {generalSaved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">Light</Button>
                  <Button variant="outline" className="flex-1">Dark</Button>
                  <Button variant="default" className="flex-1">System</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sidebar Position</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">Left</Button>
                  <Button variant="default" className="flex-1">Right</Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="compactMode" />
                <Label htmlFor="compactMode">Compact Mode</Label>
              </div>
              
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Student Updates</Label>
                    <p className="text-sm text-muted-foreground">When student records are modified</p>
                  </div>
                  <Switch id="studentUpdates" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Grade Submissions</Label>
                    <p className="text-sm text-muted-foreground">When grades are submitted</p>
                  </div>
                  <Switch id="gradeSubmissions" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="twoFactor" />
                <Label htmlFor="twoFactor">Enable two-factor authentication</Label>
              </div>
              
              <div className="pt-4">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}