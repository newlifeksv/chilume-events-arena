
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-r from-[#232f3e] to-[#0a1929] text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Chilume {currentYear}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            The ultimate celebration of sports and cultural talent
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="bg-[#ff9900] text-black hover:bg-[#e68a00] border-none text-lg px-8 font-medium">
                Explore Events
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-[#ff9900] text-[#ff9900] hover:bg-[#ff9900]/10 text-lg px-8">
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
