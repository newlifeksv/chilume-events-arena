
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Chilume</span>
          <span className="text-xl font-semibold text-secondary">{currentYear}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/events" className="font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/register" className="font-medium hover:text-primary transition-colors">
            Register
          </Link>
          {!currentUser ? (
            <Link to="/admin">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Admin Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="flex items-center space-x-2">
                  <User size={18} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="flex items-center space-x-2 text-destructive"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="py-2 font-medium hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="py-2 font-medium hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link 
              to="/register" 
              className="py-2 font-medium hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Register
            </Link>
            {!currentUser ? (
              <Link to="/admin" onClick={closeMenu}>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Admin Login
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/admin/dashboard" onClick={closeMenu}>
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-center space-x-2 text-destructive"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
