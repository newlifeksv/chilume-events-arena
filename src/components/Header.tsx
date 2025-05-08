
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
    <header className="bg-[#232f3e] text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Chilume</span>
          <span className="text-xl font-semibold text-[#ff9900]">{currentYear}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium text-gray-200 hover:text-[#ff9900] transition-colors">
            Home
          </Link>
          <Link to="/events" className="font-medium text-gray-200 hover:text-[#ff9900] transition-colors">
            Events
          </Link>
          <Link to="/register" className="font-medium text-gray-200 hover:text-[#ff9900] transition-colors">
            Register
          </Link>
          {!currentUser ? (
            <Link to="/admin">
              <Button className="bg-[#ff9900] text-black hover:bg-[#e68a00] border-none">
                Admin Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="border-gray-200 text-gray-200 hover:bg-gray-700 flex items-center space-x-2">
                  <User size={18} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="flex items-center space-x-2 text-red-300 hover:text-red-200 hover:bg-red-900/20"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-200 hover:text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1a2331] border-t border-gray-700 animate-slide-in">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="py-2 font-medium text-gray-200 hover:text-[#ff9900] transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="py-2 font-medium text-gray-200 hover:text-[#ff9900] transition-colors"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link 
              to="/register" 
              className="py-2 font-medium text-gray-200 hover:text-[#ff9900] transition-colors"
              onClick={closeMenu}
            >
              Register
            </Link>
            {!currentUser ? (
              <Link to="/admin" onClick={closeMenu}>
                <Button className="w-full bg-[#ff9900] text-black hover:bg-[#e68a00] border-none">
                  Admin Login
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/admin/dashboard" onClick={closeMenu}>
                  <Button variant="outline" className="w-full border-gray-200 text-gray-200 hover:bg-gray-700 flex items-center justify-center space-x-2">
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
                  className="w-full flex items-center justify-center space-x-2 text-red-300 hover:text-red-200 hover:bg-red-900/20"
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
