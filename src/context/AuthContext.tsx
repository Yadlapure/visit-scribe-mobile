
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '@/services/storage.service';
import { v4 as uuidv4 } from 'uuid';

type UserRole = 'admin' | 'practitioner' | 'client';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, mobile: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        await StorageService.initializeDemoData();
        const storedUser = await StorageService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await StorageService.getUsers();
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await StorageService.setCurrentUser(userWithoutPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, mobile: string, password: string): Promise<boolean> => {
    try {
      const users = await StorageService.getUsers();
      
      // Check if email already exists
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return false;
      }

      // Create new user
      const newUser = {
        id: `user-${uuidv4()}`,
        name,
        email,
        password,
        mobile,
        role: 'client' as UserRole
      };

      // Add to users list
      users.push(newUser);
      
      // Use a method that would be available in the StorageService
      // Instead of directly calling the private setData method
      await StorageService.saveUsers(users);

      // Log user in
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await StorageService.setCurrentUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    await StorageService.clearCurrentUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
