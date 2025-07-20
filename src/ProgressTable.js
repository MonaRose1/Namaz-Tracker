import React, { useState } from "react";
import { Sunrise, Sun, Sunset, CloudSun, Moon, CheckCircle, XCircle } from "lucide-react";

const PRAYERS = [
  { name: "Fajr", icon: <Sunrise size={22} strokeWidth={1.5} className="text-pink-400" /> },
  { name: "Dhuhr", icon: <Sun size={22} strokeWidth={1.5} className="text-yellow-400" /> },
  { name: "Asr", icon: <CloudSun size={22} strokeWidth={1.5} className="text-orange-400" /> },
  { name: "Maghrib", icon: <Sunset size={22} strokeWidth={1.5} className="text-pink-500" /> },
  { name: "Isha", icon: <Moon size={22} strokeWidth={1.5} className="text-indigo-400" /> },
];

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

function getDayShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function getColor(count) {
  switch (count) {
    case 5:
      return "bg-pink-400 text-white border-2 border-pink-300";
    case 4:
      return "bg-pink-200 text-pink-900 border-2 border-pink-200";
    case 3:
      return "bg-orange-400 text-white border-2 border-orange-300";
    case 2:
      return "bg-orange-200 text-orange-900 border-2 border-orange-200";
    case 1:
      return "bg-pink-100 text-pink-900 border-2 border-pink-100";
    default:
      return "bg-red-300 text-white border-2 border-red-200";
  }
}

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

function isFuture(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return d > today;
}

const ProgressTable = ({ progress }) => {
  const [showDetail, setShowDetail] = useState(null); // date string or null
  const dates = getMonthDates();

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold font-poppins mb-6 flex items-center gap-2 text-pink-700 dark:text-pink-200">
        Progress Table <span role="img" aria-label="calendar"></span>
      </h2>
      <div className="grid grid-cols-5 gap-4 max-w-2xl w-full px-2 sm:px-0">
        {dates.map((date) => {
          const prayersDone = PRAYERS.filter((p) => progress[date]?.[p.name]);
          const count = prayersDone.length;
          const isGrey = isFuture(date);
          return (
            <button
              key={date}
              className={`rounded-2xl shadow-lg h-20 flex flex-col items-center justify-center font-nunito text-base font-bold transition-all duration-150 focus:outline-none
                ${isGrey ? "bg-gray-400 text-gray-700 border-2 border-gray-400 cursor-not-allowed" : getColor(count) + " cursor-pointer hover:scale-105"}`}
              title={isGrey ? undefined : `Prayers: ${prayersDone.map(p => p.name).join(", ") || "None"}`}
              onClick={() => !isGrey && setShowDetail(date)}
              disabled={isGrey}
            >
              <span>{getDayShort(date)}</span>
              <span className="text-xs mt-1">{count}/5</span>
            </button>
          );
        })}
      </div>
      {/* Modal for details */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-pink-50 dark:bg-pink-900 rounded-3xl shadow-2xl p-8 min-w-[250px] max-w-xs flex flex-col items-center border-2 border-pink-100 dark:border-pink-800">
            <div className="font-bold font-poppins text-lg mb-2 text-pink-700 dark:text-pink-200">{getDayShort(showDetail)}</div>
            <div className="mb-4 text-sm text-pink-700 dark:text-pink-200">{showDetail}</div>
            <ul className="mb-4 w-full">
              {PRAYERS.map((p) => (
                <li key={p.name} className="flex items-center gap-2 py-1">
                  {progress[showDetail]?.[p.name] ? <CheckCircle className="text-green-400" size={18} /> : <XCircle className="text-red-300" size={18} />}
                  {p.icon}
                  <span className="font-nunito">{p.name}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-2 px-4 py-2 rounded-lg bg-pink-200 text-pink-900 font-bold hover:bg-pink-300 transition-all"
              onClick={() => setShowDetail(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mt-6 text-xs text-pink-600 dark:text-pink-200 font-nunito text-center max-w-md">
        Tap a day to see which prayers were offered. Color shows how many prayers were completed.<br/>
        <span className="inline-block mt-2">Future dates are greyed out. 5 = Pink, 4 = Light Pink, 3 = Orange, 2 = Light Orange, 1 = Very Light Pink, 0 = Red</span>
      </div>
    </div>
  );
};

export default ProgressTable; 