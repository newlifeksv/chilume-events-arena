
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event, Participant } from "@/types";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import WinnersSection from "@/components/WinnersSection";
import EventCard from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFundsCollected, setTotalFundsCollected] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Event[];
        setEvents(eventsData);
        
        // Get featured events (random 3 events)
        const shuffled = [...eventsData].sort(() => 0.5 - Math.random());
        setFeaturedEvents(shuffled.slice(0, 3));
        
        // Calculate total funds collected
        const totalFunds = eventsData.reduce((sum, event) => {
          return sum + (event.participants.length * event.fee);
        }, 0);
        setTotalFundsCollected(totalFunds);
        
        // Fetch participants
        const participantsSnapshot = await getDocs(collection(db, "participants"));
        const participantsData = participantsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Participant[];
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // For demo purposes - sample data
  const sampleEvents: Event[] = [
    {
      id: "1",
      name: "Chess Championship",
      type: "sports",
      description: "Compete in our annual chess tournament and show your strategic skills.",
      fee: 200,
      date: new Date().toISOString(),
      venue: "Main Hall",
      maxParticipants: 32,
      participants: Array(15).fill(null).map((_, i) => ({
        id: `p${i}`,
        name: `Participant ${i + 1}`,
        college: "Example College",
        phone: "9876543210",
        eventIds: ["1"],
        registeredAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamSize: 1,
      winners: [
        {
          id: "p1",
          name: "Rohit Sharma",
          college: "Engineering College",
          phone: "9876543210",
          eventIds: ["1"],
          registeredAt: new Date().toISOString()
        }
      ]
    },
    {
      id: "2",
      name: "Badminton Tournament",
      type: "sports",
      description: "Singles and doubles badminton competition for all skill levels.",
      fee: 300,
      date: new Date().toISOString(),
      venue: "Sports Complex",
      maxParticipants: 48,
      participants: Array(22).fill(null).map((_, i) => ({
        id: `p${i + 20}`,
        name: `Player ${i + 1}`,
        college: "Sports Academy",
        phone: "9876543210",
        eventIds: ["2"],
        registeredAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamSize: 2,
      winners: []
    },
    {
      id: "3",
      name: "Cultural Dance Competition",
      type: "cultural",
      description: "Showcase your dance skills representing various cultural traditions.",
      fee: 250,
      date: new Date().toISOString(),
      venue: "Auditorium",
      maxParticipants: 20,
      participants: Array(8).fill(null).map((_, i) => ({
        id: `p${i + 50}`,
        name: `Dancer ${i + 1}`,
        college: "Arts College",
        phone: "9876543210",
        eventIds: ["3"],
        registeredAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamSize: 5,
      winners: []
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;
  const displayFeatured = featuredEvents.length > 0 ? featuredEvents : sampleEvents;
  const totalParticipants = participants.length > 0 ? participants.length : 45;

  return (
    <div>
      <HeroSection />
      
      <StatsCounter 
        totalEvents={displayEvents.length}
        totalParticipants={totalParticipants}
        totalFundsCollected={totalFundsCollected || 16500} // Sample data if no real data
      />
      
      {/* Featured Events Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular events and secure your spot before they fill up.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayFeatured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <WinnersSection events={displayEvents.filter(e => e.winners && e.winners.length > 0)} />
    </div>
  );
};

export default HomePage;
