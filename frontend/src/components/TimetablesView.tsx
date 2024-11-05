import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, ChevronRight } from 'lucide-react';
import { timetables } from '../services/api';
import type { Timetable } from '../types/api';

const WEEKDAYS = ['E', 'T', 'K', 'N', 'R', 'L', 'P'];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('et-EE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatWeekdays = (weekdaysBitmask: number) => {
  // Convert bitmask (0-6) to ISO weekday format (1-7)
  return WEEKDAYS.filter((_, index) => weekdaysBitmask & (1 << index))
    .map((day, index) => WEEKDAYS[(index + 1) % 7])
    .join(', ');
};

const TimetablesView: React.FC = () => {
  const [timetableList, setTimetableList] = useState<Timetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTimetables = async () => {
      try {
        const data = await timetables.getAll();
        setTimetableList(data);
        setError(null);
      } catch (err) {
        setError('Tunniplaanide laadimine ebaõnnestus');
        console.error('Error loading timetables:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTimetables();
  }, []);

  const handleCreateNew = () => {
    navigate('/timetables/new');
  };

  const handleTimetableClick = (id: number) => {
    navigate(`/timetables/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-content-light">Laadin...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Tunniplaanid
        </h1>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Lisa tunniplaan
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {timetableList.length === 0 ? (
          <div className="text-center py-8 text-content-light">
            Ühtegi tunniplaani pole veel lisatud
          </div>
        ) : (
          timetableList.map((timetable) => (
            <div
              key={timetable.id}
              onClick={() => handleTimetableClick(timetable.id)}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-primary mb-2">
                    {timetable.name}
                  </h3>
                  <div className="text-sm text-content-light space-y-1">
                    <div>
                      Kehtib: {formatDate(timetable.valid_from)}
                      {timetable.valid_until && ` - ${formatDate(timetable.valid_until)}`}
                    </div>
                    <div>Nädalapäevad: {formatWeekdays(timetable.weekdays)}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-content-light" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimetablesView;
