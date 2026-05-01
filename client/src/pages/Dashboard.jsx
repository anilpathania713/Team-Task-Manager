import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

// --- Helper Components ---

const IconCard = ({ icon, color }) => (
  <div className={`p-3 rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-110 duration-300`}>
    {icon}
  </div>
);

const ProgressBar = ({ percentage, color }) => (
  <div className="w-full bg-slate-100 rounded-full h-2">
    <div 
      className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const CircularProgress = ({ percentage, size = 80, strokeWidth = 6, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle circumference={circumference} className="text-slate-100" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
      <circle 
        className={`transition-all duration-1000 ease-out ${color}`}
        strokeLinecap="round" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
    </svg>
  );
};

// --- Main Component ---

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };
    fetchData();
  }, []);

  const totalTasks = data?.total ?? 0;
  const completedTasks = data?.completed ?? 0;
  const pendingTasks = data?.pending ?? 0;
  const overdueTasks = data?.overdue ?? 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mock data for UI filling (Replace with real data from your API if available)
  const weeklyActivity = [40, 65, 50, 80, 45, 70, 90]; // Mon-Sun percentages
  const recentTasks = [
    { id: 1, title: "Design System Update", status: "done", time: "2h ago" },
    { id: 2, title: "API Integration", status: "in-progress", time: "4h ago" },
    { id: 3, title: "User Authentication", status: "todo", time: "Yesterday" },
    { id: 4, title: "Deploy to Production", status: "pending", time: "2 days ago" },
  ];

  const cards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: "from-violet-500 to-purple-600",
      color: { bg: "bg-violet-50", text: "text-violet-600" },
      barColor: "from-violet-400 to-purple-500",
      percentage: 100,
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      color: { bg: "bg-emerald-50", text: "text-emerald-600" },
      barColor: "from-emerald-400 to-teal-500",
      percentage: completionRate,
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-400 to-orange-500",
      color: { bg: "bg-amber-50", text: "text-amber-600" },
      barColor: "from-amber-400 to-orange-500",
      percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0,
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      gradient: "from-rose-500 to-red-600",
      color: { bg: "bg-rose-50", text: "text-rose-600" },
      barColor: "from-rose-400 to-red-500",
      percentage: totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0,
    },
  ];

  const statusStyles = {
    done: "bg-emerald-50 text-emerald-700",
    "in-progress": "bg-amber-50 text-amber-700",
    todo: "bg-slate-100 text-slate-700",
    pending: "bg-blue-50 text-blue-700",
  };

  // Get current date formatted nicely
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm text-slate-600 font-medium">
            📅 {today}
          </div>
        </div>

        {/* Top Stats Grid */}
        {!data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
                <div className="h-2 bg-slate-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <IconCard icon={card.icon} color={card.color} />
                </div>
                
                <p className="text-4xl font-extrabold text-slate-900 mb-4">
                  {card.value.toLocaleString()}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span className="font-bold">{card.percentage}%</span>
                </div>
                <ProgressBar percentage={card.percentage} color={card.barColor} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section: Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weekly Activity Chart (Pure CSS) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Weekly Activity</h2>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last 7 days</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {weeklyActivity.map((val, idx) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full bg-slate-100 rounded-lg overflow-hidden h-44 flex flex-col justify-end">
                      <div 
                        className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-lg transition-all duration-500 ease-out group-hover:from-violet-600 group-hover:to-purple-500"
                        style={{ height: `${val}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{days[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Productivity Score */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="relative flex items-center justify-center">
                <CircularProgress percentage={completionRate} color="text-violet-500" />
                <span className="absolute text-lg font-extrabold text-slate-800">{completionRate}%</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Productivity</h3>
                <p className="text-sm text-slate-500 mt-1">Tasks completed this cycle</p>
              </div>
            </div>

            {/* Recent Tasks List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Tasks</h2>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-400 group-hover:bg-violet-600 transition-colors"></div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700 transition-colors">
                        {task.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${statusStyles[task.status] || statusStyles.pending}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}