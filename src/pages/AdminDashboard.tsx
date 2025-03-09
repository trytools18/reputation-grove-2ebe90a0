
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getUserProfiles, 
  useUserProfile, 
  UserProfile, 
  logAdminAction 
} from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Users, ShieldAlert, LogIn, Activity, Layers, Settings, Calendar, ChevronDown, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const { profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not an admin
    if (!profileLoading && profile && profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [profile, profileLoading, navigate, toast]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getUserProfiles();
        setUsers(data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load users",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile, toast]);

  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setViewUserDialogOpen(true);
    // Log admin action
    logAdminAction('view_user_details', user.id).catch(console.error);
  };

  const handleImpersonateUser = async (user: UserProfile) => {
    try {
      // This is a simplified implementation
      // In production, you'd implement secure impersonation through a backend endpoint
      toast({
        title: "Impersonation",
        description: `You are now viewing the application as ${user.business_name}`,
      });
      
      // Log admin action
      await logAdminAction('impersonate_user', user.id);
      
      // Simple implementation that just signs in as the user directly
      // In a real app, you would use a more secure approach
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: 'dummy-password-that-wont-work'
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to user's dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error impersonating user:", error);
      toast({
        title: "Error",
        description: "Unable to impersonate user. This is just a demo implementation.",
        variant: "destructive"
      });
    }
  };

  if (profileLoading || (profile?.role !== 'admin' && !isLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, surveys, and system settings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="surveys">
            <Layers className="h-4 w-4 mr-2" />
            Surveys
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                    <div className="col-span-2">Business Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Created</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b">
                      <div className="col-span-2 font-medium">{user.business_name}</div>
                      <div className="text-sm">{user.email}</div>
                      <div>
                        <Badge 
                          className={
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                              : user.role === 'support' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                                : undefined
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </div>
                      <div className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleImpersonateUser(user)}>
                              <LogIn className="mr-2 h-4 w-4" />
                              Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              disabled={user.id === profile?.id}
                            >
                              <ShieldAlert className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>All Surveys</CardTitle>
              <CardDescription>View and manage surveys across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Survey management will be implemented in a future update</p>
                <Button variant="outline" className="mt-4">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Admin Activity Log</CardTitle>
              <CardDescription>Track all admin actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Activity logging will be implemented in a future update</p>
                <Button variant="outline" className="mt-4">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">System settings will be implemented in a future update</p>
                <Button variant="outline" className="mt-4">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Business Name:</div>
                <div className="col-span-2">{selectedUser.business_name}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedUser.email}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Role:</div>
                <div className="col-span-2">
                  <Badge 
                    className={
                      selectedUser.role === 'admin' 
                        ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                        : selectedUser.role === 'support' 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                          : undefined
                    }
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Business Category:</div>
                <div className="col-span-2">{selectedUser.business_category || 'Not specified'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">City:</div>
                <div className="col-span-2">{selectedUser.city || 'Not specified'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Onboarding:</div>
                <div className="col-span-2">
                  {selectedUser.onboarding_completed ? 'Completed' : 'Not completed'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Created:</div>
                <div className="col-span-2">
                  {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserDialogOpen(false)}>
              Close
            </Button>
            {selectedUser && (
              <Button onClick={() => {
                handleImpersonateUser(selectedUser);
                setViewUserDialogOpen(false);
              }}>
                <LogIn className="mr-2 h-4 w-4" />
                Impersonate
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
