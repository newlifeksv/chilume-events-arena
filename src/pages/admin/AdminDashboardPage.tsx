
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Event, Participant, Expense } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, Users, Trophy, Coins, PlusCircle, ListChecks, 
  BarChart3, UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate("/admin");
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Event[];
        setEvents(eventsData);
        
        // Fetch participants
        const participantsSnapshot = await getDocs(collection(db, "participants"));
        const participantsData = participantsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Participant[];
        setParticipants(participantsData);
        
        // Fetch expenses
        const expensesSnapshot = await getDocs(collection(db, "expenses"));
        const expensesData = expensesSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Expense[];
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  // For demo purposes - sample data
  const sampleEvents: Event[] = [
    {
      id: "1",
      name: "Chess Championship",
      type: "sports",
      description: "Compete in our annual chess tournament.",
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
      description: "Singles and doubles badminton competition.",
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
      description: "Showcase your dance skills.",
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
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;
  const totalParticipants = participants.length > 0 ? participants.length : displayEvents.reduce(
    (acc, event) => acc + event.participants.length, 0
  );
  
  const totalFundsCollected = displayEvents.reduce(
    (acc, event) => acc + (event.participants.length * event.fee), 0
  );
  
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount, 0
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-[80vh]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name || "Admin"}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => navigate("/admin/events/new")}
              className="flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>Create New Event</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-blue-100 rounded-full">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{displayEvents.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{totalParticipants}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Funds Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-purple-100 rounded-full">
                  <Coins className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">₹{totalFundsCollected}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-yellow-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">₹{totalFundsCollected - totalExpenses}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/events")}
          >
            <CalendarDays size={24} className="text-primary" />
            <span>Manage Events</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/participants")}
          >
            <Users size={24} className="text-primary" />
            <span>Manage Participants</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/matches")}
          >
            <Trophy size={24} className="text-primary" />
            <span>Manage Competitions</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/admin/expenses")}
          >
            <Coins size={24} className="text-primary" />
            <span>Manage Expenses</span>
          </Button>
        </div>

        {/* Recent Events */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.slice(0, 3).map((event) => (
              <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6" onClick={() => navigate(`/admin/events/${event.id}`)}>
                  <div className="flex justify-between mb-4">
                    <div className="font-bold text-lg truncate">{event.name}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'sports' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <CalendarDays size={14} className="mr-2 text-gray-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users size={14} className="mr-2 text-gray-500" />
                      <span>{event.participants.length}/{event.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-primary">₹{event.fee}</div>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/events/${event.id}/edit`);
                    }}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {displayEvents.length > 3 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate("/admin/events")}>
                View All Events
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
