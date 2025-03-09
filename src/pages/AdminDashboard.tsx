
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserProfiles, UserProfile, useIsAdmin, impersonateUser, logAdminAction } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { User, UserCheck, Users, Search, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const profiles = await getUserProfiles();
        setUsers(profiles);
        setFilteredUsers(profiles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load user profiles. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isAdmin, isAdminLoading, navigate, toast]);

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.business_name.toLowerCase().includes(lowercaseQuery) ||
          (user.email && user.email.toLowerCase().includes(lowercaseQuery)) ||
          (user.business_category && user.business_category.toLowerCase().includes(lowercaseQuery)) ||
          (user.city && user.city.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleImpersonateUser = async (user: UserProfile) => {
    try {
      await logAdminAction("impersonate_attempt", user.id, { targetUserEmail: user.email });
      toast({
        title: "Impersonating User",
        description: `You are now viewing as ${user.business_name}`,
      });
      // In a real implementation, you would use a secure method to impersonate
      // For demonstration, we'll just navigate to their dashboard
      await impersonateUser(user.id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error impersonating user:", error);
      toast({
        title: "Error",
        description: "Failed to impersonate user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "support":
        return <Badge className="bg-blue-500">Support</Badge>;
      default:
        return <Badge className="bg-green-500">User</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center">
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Admin Activities</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all user accounts in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full max-w-lg items-center space-x-2 mb-6">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(user.business_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm line-clamp-1">{user.business_name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                          </div>
                        </div>
                        {getRoleBadge(user.role)}
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <div className="text-xs text-muted-foreground space-y-1">
                          {user.business_category && <p>Category: {user.business_category}</p>}
                          {user.city && <p>Location: {user.city}</p>}
                          <p>Joined: {new Date(user.created_at || "").toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <User className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </DialogTrigger>
                          {selectedUser && (
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>
                                  Complete information about {selectedUser.business_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">ID:</span>
                                  <span className="text-sm">{selectedUser.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Business Name:</span>
                                  <span className="text-sm">{selectedUser.business_name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Email:</span>
                                  <span className="text-sm">{selectedUser.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Role:</span>
                                  <span className="text-sm">{selectedUser.role}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Business Category:</span>
                                  <span className="text-sm">{selectedUser.business_category || "Not set"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">City:</span>
                                  <span className="text-sm">{selectedUser.city || "Not set"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Onboarding Completed:</span>
                                  <span className="text-sm">{selectedUser.onboarding_completed ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Created At:</span>
                                  <span className="text-sm">
                                    {new Date(selectedUser.created_at || "").toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Last Updated:</span>
                                  <span className="text-sm">
                                    {selectedUser.updated_at 
                                      ? new Date(selectedUser.updated_at).toLocaleString() 
                                      : "Never"}
                                  </span>
                                </div>
                              </div>
                              <DialogFooter className="mt-6">
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="mr-2"
                                  onClick={() => handleImpersonateUser(selectedUser)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" /> Impersonate User
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleImpersonateUser(user)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" /> Impersonate
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Admin Activities</CardTitle>
              <CardDescription>View recent admin actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground">Admin activity logs will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
