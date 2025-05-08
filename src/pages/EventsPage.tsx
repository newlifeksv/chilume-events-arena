
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sports" | "cultural">("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Event[];
        setEvents(eventsData);
        setFilteredEvents(eventsData);

        // For demo purposes - if no events in database
        if (eventsData.length === 0) {
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
              teamSize: 1
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
              teamSize: 2
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
              teamSize: 5
            },
            {
              id: "4",
              name: "Singing Competition",
              type: "cultural",
              description: "Show your vocal talent in our popular singing contest.",
              fee: 150,
              date: new Date().toISOString(),
              venue: "Music Hall",
              maxParticipants: 30,
              participants: Array(12).fill(null).map((_, i) => ({
                id: `p${i + 100}`,
                name: `Singer ${i + 1}`,
                college: "Music Academy",
                phone: "9876543210",
                eventIds: ["4"],
                registeredAt: new Date().toISOString()
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              teamSize: 1
            },
            {
              id: "5",
              name: "Table Tennis Tournament",
              type: "sports",
              description: "Fast-paced table tennis competition for singles and doubles.",
              fee: 250,
              date: new Date().toISOString(),
              venue: "Indoor Sports Hall",
              maxParticipants: 40,
              participants: Array(18).fill(null).map((_, i) => ({
                id: `p${i + 150}`,
                name: `TT Player ${i + 1}`,
                college: "Sports Institute",
                phone: "9876543210",
                eventIds: ["5"],
                registeredAt: new Date().toISOString()
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              teamSize: 1
            }
          ];
          setEvents(sampleEvents);
          setFilteredEvents(sampleEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Apply filters
    let results = [...events];
    
    // Filter by type
    if (typeFilter !== "all") {
      results = results.filter(event => event.type === typeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(
        event => 
          event.name.toLowerCase().includes(searchTermLower) || 
          event.description.toLowerCase().includes(searchTermLower)
      );
    }
    
    setFilteredEvents(results);
  }, [searchTerm, typeFilter, events]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Explore Events</h1>
        
        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        
        {/* Results */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No events found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
