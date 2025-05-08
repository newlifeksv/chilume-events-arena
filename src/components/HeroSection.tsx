
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Chilume {currentYear}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            The ultimate celebration of sports and cultural talent
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8">
                Explore Events
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
