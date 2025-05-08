
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Award, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const eventDoc = await getDoc(doc(db, "events", id));
        
        if (eventDoc.exists()) {
          const eventData = { ...eventDoc.data(), id: eventDoc.id } as Event;
          setEvent(eventData);
          
          // Fetch rules in real app, here simulate with a delay
          setRules(null);
          const sportType = eventData.name.toLowerCase();
          setTimeout(() => {
            setRules(`
              # Rules for ${eventData.name}
              
              1. All participants must report 30 minutes before the event starts.
              2. Participants must bring their college ID card.
              3. The decision of judges/referees will be final.
              4. No arguments or fights will be tolerated.
              5. Event-specific rules will be explained before the start.
              
              ${sportType.includes("chess") ? `
              ## Chess Specific Rules
              - Standard FIDE rules apply
              - Time control: 15 minutes per player
              - Touch-move rule is enforced
              - Illegal moves result in immediate loss
              ` : ""}
              
              ${sportType.includes("badminton") ? `
              ## Badminton Specific Rules
              - BWF rules will be followed
              - Matches will be best of 3 sets
              - Each set is played to 21 points
              - Players must bring their own racquets
              ` : ""}
              
              ${sportType.includes("dance") ? `
              ## Dance Competition Rules
              - Performance time limit: 5 minutes
              - Teams can have 5-10 members
              - Props are allowed but must be approved
              - Vulgarity in any form will lead to disqualification
              ` : ""}
            `);
          }, 1000);
        } else {
          toast.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const availableSlots = event.maxParticipants - event.participants.length;
  const isFullyBooked = availableSlots <= 0;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/events" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Events
          </Link>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                  <Badge className={event.type === "sports" ? "bg-blue-600" : "bg-green-600"}>
                    {event.type === "sports" ? "Sports" : "Cultural"}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{event.fee}</div>
                  <div className="text-sm text-gray-500">Registration Fee</div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-8">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div>{formattedDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div>{formattedTime}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Venue</div>
                      <div>{event.venue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Participants</div>
                      <div>
                        {event.participants.length} registered
                        {availableSlots > 0 ? `, ${availableSlots} slots left` : ", fully booked"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Team Size</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{event.teamSize === 1 ? "Individual" : `${event.teamSize} members`}</span>
                  </div>
                </div>
                
                <Link to={`/register?eventId=${event.id}`}>
                  <Button size="lg" disabled={isFullyBooked}>
                    {isFullyBooked ? "Fully Booked" : "Register Now"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Rules Section */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Event Rules</h2>
              </div>
              
              {rules ? (
                <div className="prose max-w-none">
                  {rules.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line.startsWith("# ") ? (
                        <h2 className="text-xl font-bold mt-6 mb-3">{line.substring(2)}</h2>
                      ) : line.startsWith("## ") ? (
                        <h3 className="text-lg font-semibold mt-5 mb-2">{line.substring(3)}</h3>
                      ) : line.startsWith("- ") ? (
                        <div className="flex items-start gap-2 my-1">
                          <span className="text-primary pt-1">•</span>
                          <p>{line.substring(2)}</p>
                        </div>
                      ) : (
                        line && <p className="my-2">{line}</p>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="py-8">
                  <div className="animate-pulse flex space-x-4 items-center justify-center">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading rules...</p>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  Note: All participants must adhere strictly to these rules. The decision of the organizers will be final.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
