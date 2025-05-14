
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-healthcare-primary text-5xl font-bold mb-2">404</div>
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <p className="text-healthcare-gray mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-healthcare-primary hover:bg-healthcare-primary/90"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
