
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
    <div className="bg-[#f2f3f3] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#eaedfd] p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-[#545b64]" />
              </div>
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">{totalEvents}</div>
              <div className="text-[#545b64]">Events</div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#e8f3eb] p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-[#2d8653]" />
              </div>
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">{totalParticipants}</div>
              <div className="text-[#545b64]">Participants</div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#fff8e6] p-4 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-[#ff9900]" />
              </div>
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">{totalEvents * 2}</div>
              <div className="text-[#545b64]">Winners</div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f1eaf8] p-4 rounded-full mb-4">
                <Coins className="h-8 w-8 text-[#5f4b8b]" />
              </div>
              <div className="text-3xl font-bold mb-2 text-[#232f3e]">₹{totalFundsCollected.toLocaleString()}</div>
              <div className="text-[#545b64]">Funds Collected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
