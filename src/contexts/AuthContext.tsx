
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Admin, AuthContextType } from "@/types";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const adminQuery = query(
            collection(db, "admins"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(adminQuery);
          
          if (!querySnapshot.empty) {
            const adminData = querySnapshot.docs[0].data() as Admin;
            setCurrentUser({
              ...adminData,
              id: querySnapshot.docs[0].id
            });
          }
        } catch (err) {
          console.error("Error fetching admin data:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login with auth key
  const login = async (authKey: string) => {
    try {
      setLoading(true);
      setError(null);
      // In a real-world scenario, you would verify the authKey against a database
      // Here we're using a simple email+password auth with Firebase
      // The authKey would map to a specific admin email/password combination
      
      // For demo purposes, we're using a fixed mapping
      const email = `admin@chilume2025.org`;
      const password = authKey;
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in as admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid authentication key");
      toast.error("Invalid authentication key");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success("Successfully logged out");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error logging out");
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
