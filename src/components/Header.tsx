
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightContent }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 bg-white h-16 border-b border-gray-200 shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-medium text-healthcare-primary">{title}</h1>
      </div>
      {rightContent && (
        <div>
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default Header;
