import React from 'react';
import { Calendar, Clock, Bell, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const HomeCalendarView = () => {
  const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="15 12 85 32" className="w-24">
      <path d="M40 40 L40 15 M40 40 L55 40" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round"
            fill="none"/>
      <path d="M40 15 A25 25 0 0 1 65 40" 
            stroke="currentColor" 
            strokeWidth="0.5"
            strokeDasharray="0.5,4"
            fill="none"/>
      <circle cx="52.5" cy="18.4" r="1.2" fill="currentColor"/>
      <circle cx="61.6" cy="27.5" r="1.2" fill="currentColor"/>
      <text x="59" y="41" 
            fontFamily="Arial" 
            fontSize="20" 
            fontWeight="300"
            fill="currentColor"
            letterSpacing="1">ıble</text>
    </svg>
  );

  // Helper funktsioon kontrollimaks kas päev on nädalavahetus
  const isWeekend = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 0;

  // Kalendri andmed novembri 2024 jaoks
  const calendarData = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - 4; // November algab reedel (indeks 4)
    if (dayNumber < 0 || dayNumber >= 30) return null; // November on 30-päevane

    const date = new Date(2024, 10, dayNumber + 1);
    const dayOfWeek = date.getDay();
    
    // Määrame päeva tüübi
    let type = 'default';
    if (isWeekend(dayOfWeek)) {
      type = 'none';
    } else if (dayNumber + 1 === 22) {
      type = 'special';
    }
    
    return {
      day: dayNumber + 1,
      type
    };
  });

  const selectedDaySchedule = [
    { time: '07:58', name: 'Eelkell', sound: 'Lühike kell' },
    { time: '08:00', name: '1. tund algab', sound: 'Pikk kell' },
    { time: '08:45', name: '1. tund lõpeb', sound: 'Pikk kell' },
    { time: '08:53', name: 'Eelkell', sound: 'Lühike kell' },
    { time: '08:55', name: '2. tund algab', sound: 'Pikk kell' },
    { time: '09:40', name: '2. tund lõpeb', sound: 'Pikk kell' },
  ];

  const getDateClass = (type) => {
    switch (type) {
      case 'default':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'special':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'none':
        return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
      default:
        return 'hover:bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 text-primary">
                <Logo />
              </div>
              
              {/* Main navigation */}
              <nav className="ml-8 flex space-x-4">
                <a href="/calendar" 
                   className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-background text-primary">
                  <Calendar className="w-5 h-5 mr-1.5" />
                  Kalender
                </a>
                <a href="/timetables" 
                   className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-content-light hover:text-primary hover:bg-background">
                  <Clock className="w-5 h-5 mr-1.5" />
                  Tunniplaanid
                </a>
                <a href="/templates" 
                   className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-content-light hover:text-primary hover:bg-background">
                  <Bell className="w-5 h-5 mr-1.5" />
                  Mallid
                </a>
                <a href="/holidays" 
                   className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-content-light hover:text-primary hover:bg-background">
                  <Calendar className="w-5 h-5 mr-1.5" />
                  Pühad
                </a>
              </nav>
            </div>

            {/* Right side menu */}
            <div className="flex items-center">
              <button className="p-2 text-content-light rounded-lg hover:bg-background hover:text-primary">
                <Settings className="w-5 h-5" />
              </button>
              <button className="ml-2 p-2 text-content-light rounded-lg hover:bg-background hover:text-primary">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left side - Calendar */}
          <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
            {/* Calendar header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-primary">November 2024</h1>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-background rounded-lg text-content-light">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-background rounded-lg text-content-light">
                  <Calendar className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-background rounded-lg text-content-light">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['E', 'T', 'K', 'N', 'R', 'L', 'P'].map(day => (
                <div key={day} className="text-sm font-medium text-content-light text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((data, index) => {
                if (!data) return (
                  <div key={index} className="aspect-square p-2" />
                );
                
                return (
                  <button 
                    key={index} 
                    className={`
                      aspect-square p-2 rounded-lg text-sm
                      ${getDateClass(data.type)}
                      ${data.day === 4 ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <span className="font-medium">{data.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - Day details */}
          <div className="w-1/3 space-y-4">
            {/* Selected day info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-content">4. november 2024</h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                  Tavaline päev
                </span>
              </div>
              <p className="text-sm text-content-light">
                Kehtib tunniplaan: Tavaline tunniplaan
              </p>
            </div>

            {/* Day schedule */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-content mb-4">Tunniplaan</h3>
              <div className="space-y-3">
                {selectedDaySchedule.map((event, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-content-light w-16">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex-grow text-content">
                      {event.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeCalendarView;