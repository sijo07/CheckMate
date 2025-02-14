import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import "../index.css";
import TopTargetCountry from "../components/map/topTargetCountry";
import TopTargetIndustry from "../components/map/topTargetIndustry";
import TopMalwareType from "../components/map/topMalwareType";
import CyberMap from "../components/map/cyberMap";
import IncidentFeed from "../components/map/incidentFeed";
import {
  useGetAllIncidentsQuery,
  useGetAttacksOnThisDayQuery,
} from "../redux/api/incidentApiSlice";

const CyberThreatMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [attacksOnThisDay, setAttacksOnThisDay] = useState(0); // ✅ Local state for live update

  // Fetch initial API data
  const {
    data: fetchedIncidents,
    isLoading,
    error,
  } = useGetAllIncidentsQuery();
  const { data: attacksOnThisDayData } = useGetAttacksOnThisDayQuery();

  // Update incidents when API data changes
  useEffect(() => {
    if (fetchedIncidents) {
      setIncidents(fetchedIncidents);
    }
  }, [fetchedIncidents]);

  // ✅ Update attacksOnThisDay from API initially
  useEffect(() => {
    if (attacksOnThisDayData?.attacksOnThisDay) {
      setAttacksOnThisDay(attacksOnThisDayData.attacksOnThisDay);
    }
  }, [attacksOnThisDayData]);

  // WebSocket: Listen for real-time incidents
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("new-incident", (newIncidents) => {
      setIncidents((prevIncidents) => [...newIncidents, ...prevIncidents]);

      // ✅ Dynamically update attacks count when new incident arrives
      setAttacksOnThisDay((prev) => prev + newIncidents.length);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 py-4">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">
        {/* Left Sidebar (Industries & Malware) */}
        <aside className="lg:col-span-3 space-y-4 flex flex-col">
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg flex-grow">
            <TopMalwareType />
          </div>
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg flex-grow">
            <TopTargetIndustry />
          </div>
        </aside>

        {/* Middle Section (Cyber Map) */}
        <section className="lg:col-span-6 space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">LIVE CYBER THREAT MAP</h1>
            <p className="text-[#ff335e] text-lg font-semibold">
              {attacksOnThisDay.toLocaleString()} ATTACKS ON THIS DAY
            </p>
          </div>

          <div className="w-full h-[500px] lg:h-[600px]">
            {isLoading ? (
              <p className="text-gray-300 text-center">Loading incidents...</p>
            ) : error ? (
              <p className="text-[#ff335e] text-center">
                Error fetching incidents
              </p>
            ) : (
              <CyberMap incidents={incidents} />
            )}
          </div>
        </section>

        {/* Right Sidebar (Incident Feed & Top Countries) */}
        <aside className="lg:col-span-3 space-y-4 flex flex-col">
          <div className="bg-gray-950 rounded-lg p-4 shadow-lg flex-grow">
            <IncidentFeed />
          </div>
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg flex-grow">
            <TopTargetCountry />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CyberThreatMap;
