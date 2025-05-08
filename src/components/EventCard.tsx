
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
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 bg-[#fafafa]">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-[#232f3e]">{name}</CardTitle>
          <Badge className={type === "sports" ? "bg-[#0073bb] text-white" : "bg-[#2d8653] text-white"}>
            {type === "sports" ? "Sports" : "Cultural"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-2 text-[#545b64]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#545b64]">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-[#545b64]">
            <MapPin className="w-4 h-4" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2 text-[#545b64]">
            <Users className="w-4 h-4" />
            <span>
              {participants.length}/{maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium text-[#232f3e]">
            <span>Entry Fee:</span>
            <span className="text-[#0073bb]">₹{fee}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2 bg-[#fafafa]">
        <Link to={`/events/${id}`} className="flex-1">
          <Button variant="outline" className="w-full border-[#d5dbdb] text-[#545b64] hover:bg-[#f2f3f3]">View Details</Button>
        </Link>
        <Link to={`/register?eventId=${id}`} className="flex-1">
          <Button 
            disabled={isFullyBooked}
            className="w-full bg-[#ff9900] text-black hover:bg-[#e68a00] border-none"
          >
            {isFullyBooked ? "Fully Booked" : "Register"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
