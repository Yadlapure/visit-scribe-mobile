
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface AdminLinkProps {
  className?: string;
}

const AdminLink: React.FC<AdminLinkProps> = ({ className }) => {
  // In a real app, you would check if the current user has admin permissions
  // For now, we'll just display the link
  return (
    <Button asChild variant="ghost" className={className}>
      <Link to="/admin" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
};

export default AdminLink;
