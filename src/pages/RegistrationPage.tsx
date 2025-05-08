
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event, Participant } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const RegistrationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedEventId = searchParams.get("eventId");
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    phone: "",
    email: "", // Optional
    eventId: preSelectedEventId || ""
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsSnapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: doc.id 
        })) as Event[];
        setEvents(eventsData);
        
        // For demo, use sample data if no events in database
        if (eventsData.length === 0) {
          setEvents([
            {
              id: "1",
              name: "Chess Championship",
              type: "sports",
              description: "Compete in our annual chess tournament.",
              fee: 200,
              date: new Date().toISOString(),
              venue: "Main Hall",
              maxParticipants: 32,
              participants: [],
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
              participants: [],
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
              participants: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              teamSize: 5
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.college || !formData.phone || !formData.eventId) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate email if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      setSubmitting(true);

      // Check if the event exists and has available slots
      const selectedEvent = events.find(e => e.id === formData.eventId);
      if (!selectedEvent) {
        toast.error("Selected event not found");
        return;
      }

      if (selectedEvent.participants.length >= selectedEvent.maxParticipants) {
        toast.error("This event is fully booked");
        return;
      }

      // Check if participant already registered for this event by phone number
      const isAlreadyRegistered = selectedEvent.participants.some(
        p => p.phone === formData.phone
      );

      if (isAlreadyRegistered) {
        toast.error("You have already registered for this event");
        return;
      }

      // Create participant data
      const participantData: Participant = {
        id: `p_${Date.now()}`, // Generate a temporary ID
        name: formData.name,
        college: formData.college,
        phone: formData.phone,
        email: formData.email || undefined,
        eventIds: [formData.eventId],
        registeredAt: new Date().toISOString()
      };

      // Add participant to the database
      const participantRef = doc(collection(db, "participants"));
      await setDoc(participantRef, {
        ...participantData,
        id: participantRef.id // Replace temporary ID with Firestore ID
      });

      // Update event with new participant
      const eventRef = doc(db, "events", formData.eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion({
          id: participantRef.id,
          name: participantData.name,
          college: participantData.college,
          phone: participantData.phone,
          registeredAt: participantData.registeredAt
        }),
        updatedAt: new Date().toISOString()
      });

      toast.success("Registration successful!");
      
      // Reset form and redirect
      setFormData({
        name: "",
        college: "",
        phone: "",
        email: "",
        eventId: ""
      });
      
      navigate(`/registration-success?eventId=${formData.eventId}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEvent = events.find(e => e.id === formData.eventId);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Event Registration</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Participant Registration Form</CardTitle>
              <CardDescription>
                Register for your favorite events by filling out this form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event">Select Event*</Label>
                    <Select
                      value={formData.eventId}
                      onValueChange={handleEventChange}
                      disabled={loading || submitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem 
                            key={event.id} 
                            value={event.id}
                            disabled={event.participants.length >= event.maxParticipants}
                          >
                            {event.name} {event.participants.length >= event.maxParticipants ? "(Full)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEvent && (
                    <div className="bg-blue-50 p-4 rounded-md text-sm">
                      <p><strong>Event:</strong> {selectedEvent.name}</p>
                      <p><strong>Type:</strong> {selectedEvent.type}</p>
                      <p><strong>Registration Fee:</strong> ₹{selectedEvent.fee}</p>
                      <p><strong>Available Slots:</strong> {selectedEvent.maxParticipants - selectedEvent.participants.length} of {selectedEvent.maxParticipants}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Full Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="college">College/Institution*</Label>
                    <Input
                      id="college"
                      name="college"
                      placeholder="Enter your college or institution"
                      value={formData.college}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                      maxLength={10}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || submitting || !formData.eventId || !formData.name || !formData.college || !formData.phone}
                  >
                    {submitting ? "Registering..." : "Register Now"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
