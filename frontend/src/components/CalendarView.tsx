import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
  // Helper funktsioon kontrollimaks kas päev on nädalavahetus
  const isWeekend = (dayOfWeek: number) => dayOfWeek === 6 || dayOfWeek === 0;

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

  const getDateClass = (type: string) => {
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
              <CalendarIcon className="w-5 h-5" />
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
  );
};

export default CalendarView;
