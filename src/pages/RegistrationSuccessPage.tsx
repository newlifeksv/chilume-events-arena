
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, MapPin, InfoIcon } from "lucide-react";

const RegistrationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEvent({ ...eventDoc.data(), id: eventDoc.id } as Event);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const formattedDate = event?.date 
    ? new Date(event.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription>
            Thank you for registering for Chilume {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {event ? (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{event.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                  <span>Entry Fee: ₹{event.fee}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Your registration has been confirmed.</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md text-sm">
            <p className="font-medium text-blue-800 mb-1">Important Information:</p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Please bring your ID card on the day of the event.</li>
              <li>Payment will be collected at the venue.</li>
              <li>Arrive 30 minutes before the event start time.</li>
              <li>For any queries, contact the organizers.</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Link to="/" className="w-full">
            <Button className="w-full" variant="default">
              Return to Home
            </Button>
          </Link>
          <Link to="/events" className="w-full">
            <Button className="w-full" variant="outline">
              Browse More Events
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationSuccessPage;
