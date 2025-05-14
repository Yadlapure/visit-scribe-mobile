
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { StorageService } from '@/services/storage.service';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await StorageService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const handleClearData = async () => {
    try {
      // Clear all data except the user
      await StorageService.saveVisits([]);
      toast.success('Data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Profile" showBack={true} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Profile" showBack={true} />
        <div className="p-4 text-center">
          <p>User not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Profile" showBack={true} />
      
      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-4">
          <CardHeader className="bg-healthcare-lightGray py-3 px-4">
            <CardTitle className="text-lg">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0EA5E9&color=fff`} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-healthcare-gray capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader className="bg-healthcare-lightGray py-3 px-4">
            <CardTitle className="text-lg">App Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Version</h4>
                <p className="text-sm text-healthcare-gray">Healthcare Visits 1.0.0</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium">About</h4>
                <p className="text-sm text-healthcare-gray">
                  This application is designed to help healthcare practitioners track and verify patient home visits with location tracking, selfie verification, and vitals recording.
                </p>
              </div>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={handleClearData}
              >
                Clear Visit Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
