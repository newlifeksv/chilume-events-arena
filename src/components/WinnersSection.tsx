
import React from "react";
import { Trophy } from "lucide-react";
import { Event } from "@/types";

interface WinnersSectionProps {
  events: Event[];
}

const WinnersSection: React.FC<WinnersSectionProps> = ({ events }) => {
  // Filter events with winners
  const eventsWithWinners = events.filter(event => event.winners && event.winners.length > 0);

  if (eventsWithWinners.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Congratulations to Our Winners!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrating the exceptional talent and hard work of our champions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsWithWinners.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 card-hover">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-bold">{event.name}</h3>
              </div>
              
              <div className="space-y-4">
                {event.winners?.map((winner, index) => (
                  <div key={winner.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{winner.name}</p>
                      <p className="text-sm text-gray-500">{winner.college}</p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                      {index === 0 ? "1st Place" : index === 1 ? "2nd Place" : "3rd Place"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnersSection;
