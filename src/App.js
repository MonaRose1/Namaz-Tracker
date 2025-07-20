import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomeTracker from "./ContributionTable";
import ProgressTable from "./ProgressTable";
import './App.css';
import { Home, CalendarDays, BarChart2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STORAGE_KEY = "namaz-tracker-progress";

function getMonthDates() {
  const dates = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function Stats({ progress }) {
  const dates = getMonthDates();
  const data = dates.map(date => {
    const prayers = progress[date] || {};
    const count = Object.values(prayers).filter(Boolean).length;
    return { date: new Date(date).getDate(), count };
  });
  const hasProgress = data.some(d => d.count > 0);
  const pastelColors = ["#F8C8DC", "#FADADD", "#FDE2FF", "#B5EAD7", "#C7CEEA", "#FFF1C1", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
  return (
    <div className="p-8 flex flex-col items-center justify-center font-nunito text-lg w-full">
      <BarChart2 size={56} strokeWidth={1.5} className="text-orange-400 mb-2" />
      <div className="bg-pink-50 dark:bg-pink-900 rounded-3xl shadow-xl p-8 border-2 border-pink-100 dark:border-pink-800 flex flex-col items-center w-full max-w-2xl">
        <span className="flex items-center gap-2 text-pink-500 font-bold text-xl mb-2">Monthly Progress <Sparkles size={24} className="text-pink-400" /></span>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#f472b6' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 12, fill: '#f472b6' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff0f6', borderRadius: 12, border: '1px solid #f8c8dc', fontFamily: 'Nunito, sans-serif', color: '#d946ef' }} />
              <Bar dataKey="count" radius={[12,12,0,0]}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={hasProgress ? pastelColors[entry.count] || '#F8C8DC' : '#F8C8DC'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!hasProgress && (
          <span className="mt-4 flex items-center gap-2 text-pink-500 font-bold text-lg">No stats yet <Sparkles size={20} className="text-pink-400" /></span>
        )}
      </div>
    </div>
  );
}

function App() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <nav className="flex justify-center items-center gap-6 py-4 bg-pink-100/80 dark:bg-pink-900/80 shadow font-poppins rounded-b-3xl mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-pink-200 bg-white shadow-lg mr-3 flex items-center justify-center">
            <img src="/namaz-girl.png" alt="Namaz Girl Logo" className="w-full h-full object-contain" />
          </div>
          <Link to="/" className="flex items-center gap-2 hover:text-pink-500 transition-colors font-bold text-lg"><Home size={22} strokeWidth={1.5} className="text-pink-400" /> Home</Link>
          <Link to="/progress" className="flex items-center gap-2 hover:text-pink-500 transition-colors font-bold text-lg"><CalendarDays size={22} strokeWidth={1.5} className="text-yellow-400" /> Progress</Link>
          <Link to="/stats" className="flex items-center gap-2 hover:text-pink-500 transition-colors font-bold text-lg"><BarChart2 size={22} strokeWidth={1.5} className="text-orange-400" /> Stats</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomeTracker progress={progress} setProgress={setProgress} />} />
          <Route path="/progress" element={<ProgressTable progress={progress} setProgress={setProgress} />} />
          <Route path="/stats" element={<Stats progress={progress} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
