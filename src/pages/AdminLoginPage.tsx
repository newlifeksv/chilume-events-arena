
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const AdminLoginPage = () => {
  const [authKey, setAuthKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authKey.trim()) return;

    try {
      setIsSubmitting(true);
      await login(authKey);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your authentication key to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-key">Authentication Key</Label>
              <Input
                id="auth-key"
                type="password"
                placeholder="Enter your auth key"
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                autoComplete="off"
                required
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !authKey.trim()}
            >
              {isSubmitting ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
