
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Profile" showBack={true} />
        <div className="p-4 text-center">
          <p>User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Profile" showBack={true} />
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <FaUserCircle className="h-24 w-24 text-healthcare-primary" />
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <FaIdBadge className="h-5 w-5 mr-3 text-healthcare-primary" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <FaEnvelope className="h-5 w-5 mr-3 text-healthcare-primary" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
