import React from "react";
import { Sunrise, Sun, Sunset, CloudSun, Moon, Sparkles } from "lucide-react";

const PRAYERS = [
  { name: "Fajr", icon: <Sunrise size={28} strokeWidth={1.5} className="text-pink-400" /> },
  { name: "Dhuhr", icon: <Sun size={28} strokeWidth={1.5} className="text-yellow-400" /> },
  { name: "Asr", icon: <CloudSun size={28} strokeWidth={1.5} className="text-orange-400" /> },
  { name: "Maghrib", icon: <Sunset size={28} strokeWidth={1.5} className="text-pink-500" /> },
  { name: "Isha", icon: <Moon size={28} strokeWidth={1.5} className="text-indigo-400" /> },
];

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getDayString(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

const MOTIVATIONAL_QUOTES = [
  "Indeed, prayer prohibits immorality and wrongdoing. (Qur'an 29:45)",
  "Establish prayer and give zakah. (Qur'an 2:43)",
  "Verily, in the remembrance of Allah do hearts find rest. (Qur'an 13:28)",
  "The closest a servant comes to his Lord is when he is prostrating. (Hadith)",
  "Prayer is the key to Paradise. (Hadith)"
];

const getRandomQuote = () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

const HomeTracker = ({ progress, setProgress }) => {
  const today = getToday();
  const [quote] = React.useState(getRandomQuote());

  const togglePrayer = (prayer) => {
    setProgress((prev) => {
      const day = prev[today] ? { ...prev[today] } : {};
      day[prayer] = !day[prayer];
      return { ...prev, [today]: day };
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 bg-white shadow-xl mb-4 flex items-center justify-center">
        <img src="/namaz-girl.png" alt="Namaz Girl Logo" className="w-full h-full object-contain" />
      </div>
      <h2 className="text-2xl font-bold font-poppins mb-2 flex items-center gap-2 text-pink-700 dark:text-pink-200">
        Today's Prayers <Sparkles size={28} strokeWidth={1.5} className="text-pink-400" />
      </h2>
      <div className="text-lg font-nunito text-pink-700 dark:text-pink-200 mb-6">
        {getDayString(today)}
      </div>
      <div className="bg-pink-50 dark:bg-pink-900 rounded-3xl shadow-2xl p-8 flex flex-col gap-5 w-full max-w-sm border-2 border-pink-100 dark:border-pink-800">
        {PRAYERS.map((prayer) => (
          <label key={prayer.name} className="flex items-center gap-3 cursor-pointer text-lg font-baloo">
            <input
              type="checkbox"
              checked={!!progress[today]?.[prayer.name]}
              onChange={() => togglePrayer(prayer.name)}
              className="w-6 h-6 accent-pink-400 rounded-full border-2 border-pink-300 focus:ring-2 focus:ring-pink-300 transition-all shadow-sm"
            />
            {prayer.icon}
            <span>{prayer.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-8 text-center text-base font-nunito text-pink-600 dark:text-pink-200 italic max-w-md bg-pink-50 dark:bg-pink-900 rounded-xl shadow-md px-6 py-4 border border-pink-100 dark:border-pink-800">
        “{quote}”
      </div>
    </div>
  );
};

export default HomeTracker; 