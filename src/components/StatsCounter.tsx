
import React from "react";
import { Trophy, Users, Calendar, Coins } from "lucide-react";

interface StatsCounterProps {
  totalEvents: number;
  totalParticipants: number;
  totalFundsCollected: number;
}

const StatsCounter: React.FC<StatsCounterProps> = ({ 
  totalEvents, 
  totalParticipants, 
  totalFundsCollected 
}) => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">{totalEvents}</div>
            <div className="text-gray-600">Events</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold mb-2">{totalParticipants}</div>
            <div className="text-gray-600">Participants</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-50 p-4 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold mb-2">{totalEvents * 2}</div>
            <div className="text-gray-600">Winners</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-50 p-4 rounded-full mb-4">
              <Coins className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold mb-2">₹{totalFundsCollected.toLocaleString()}</div>
            <div className="text-gray-600">Funds Collected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
