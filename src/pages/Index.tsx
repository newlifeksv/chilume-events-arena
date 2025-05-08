
import React, { useEffect } from "react";
import HomePage from "./HomePage";

const Index = () => {
  useEffect(() => {
    // Add AWS Console inspired title
    document.title = "Chilume " + new Date().getFullYear() + " | Event Management";
    
    // You can add AWS-style page load analytics here in the future
  }, []);

  return <HomePage />;
};

export default Index;
