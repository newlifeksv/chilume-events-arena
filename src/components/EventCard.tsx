
import React from "react";
import { Event } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { id, name, type, description, fee, date, venue, maxParticipants, participants } = event;
  
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const availableSlots = maxParticipants - participants.length;
  const isFullyBooked = availableSlots <= 0;

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge className={type === "sports" ? "bg-blue-600" : "bg-green-600"}>
            {type === "sports" ? "Sports" : "Cultural"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {participants.length}/{maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>Entry Fee:</span>
            <span className="text-primary">₹{fee}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Link to={`/events/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        <Link to={`/register?eventId=${id}`} className="flex-1">
          <Button 
            disabled={isFullyBooked}
            className="w-full"
          >
            {isFullyBooked ? "Fully Booked" : "Register"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
