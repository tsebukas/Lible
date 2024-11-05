import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Pencil, Bell, Save, Trash2, Plus, X } from 'lucide-react';
import { timetables } from '../services/api';
import type { Timetable, TimetableEvent } from '../types/api';
import EventDialog from './EventDialog';
import TemplateDialog from './TemplateDialog';

const WEEKDAYS = [
  { id: 1, label: 'E' },
  { id: 2, label: 'T' },
  { id: 3, label: 'K' },
  { id: 4, label: 'N' },
  { id: 5, label: 'R' },
  { id: 6, label: 'L' },
  { id: 7, label: 'P' }
];

interface TimetableData extends Omit<Timetable, 'weekdays'> {
  weekdays: number[];
}

const TimetableDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | undefined>(undefined);

  const loadTimetable = async () => {
    if (!id) return;

    try {
      const data = await timetables.getById(parseInt(id));
      // Convert weekdays bitmask to array of ISO weekday numbers (1-7)
      const weekdaysArray = Array.from({ length: 7 }, (_, i) => i)
        .filter(day => data.weekdays & (1 << day))
        .map(day => day + 1);

      const timetableData = {
        ...data,
        weekdays: weekdaysArray
      };

      setTimetable(timetableData);

      // Load events
      const eventsData = await timetables.getEvents(parseInt(id));
      setEvents(eventsData);
      
      setError(null);
    } catch (err) {
      console.error('Error loading timetable:', err);
      setError('Tunniplaani laadimine ebaõnnestus');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadTimetable(); // Laeme tunniplaani andmed uuesti
  };

  const handleSave = async () => {
    if (!timetable) return;

    try {
      // Convert weekdays array back to bitmask
      const weekdaysBitmask = timetable.weekdays
        .reduce((acc, day) => acc | (1 << (day - 1)), 0);

      await timetables.update(timetable.id, {
        name: timetable.name,
        valid_from: timetable.valid_from,
        valid_until: timetable.valid_until,
        weekdays: weekdaysBitmask
      });

      setIsEditing(false);
      loadTimetable(); // Laeme tunniplaani andmed uuesti
      setError(null);
    } catch (err) {
      console.error('Error updating timetable:', err);
      setError('Tunniplaani salvestamine ebaõnnestus');
    }
  };

  const handleDelete = async () => {
    if (!timetable || !window.confirm('Kas olete kindel, et soovite tunniplaani kustutada?')) {
      return;
    }

    try {
      await timetables.delete(timetable.id);
      navigate('/timetables');
    } catch (err) {
      console.error('Error deleting timetable:', err);
      setError('Tunniplaani kustutamine ebaõnnestus');
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setShowEventDialog(true);
  };

  const handleEditEvent = (event: TimetableEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!timetable || !window.confirm('Kas olete kindel, et soovite sündmuse kustutada?')) {
      return;
    }

    try {
      await timetables.deleteEvent(timetable.id, eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Sündmuse kustutamine ebaõnnestus');
    }
  };

  const handleSaveEvent = async (data: Omit<TimetableEvent, 'id' | 'timetable_id'>) => {
    if (!timetable) return;

    try {
      if (selectedEvent) {
        const updatedEvent = await timetables.updateEvent(timetable.id, selectedEvent.id, data);
        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
      } else {
        const newEvent = await timetables.createEvent(timetable.id, data);
        setEvents([...events, newEvent]);
      }
    } catch (err) {
      console.error('Error saving event:', err);
      throw err;
    }
  };

  const handleAddFromTemplate = () => {
    setShowTemplateDialog(true);
  };

  const handleApplyTemplate = async (templateId: number, baseTime: string) => {
    if (!timetable) return;

    try {
      // TODO: Implement template application logic when backend supports it
      console.log('Applying template:', templateId, 'with base time:', baseTime);
    } catch (err) {
      console.error('Error applying template:', err);
      throw err;
    }
  };

  const handleWeekdayToggle = (dayId: number) => {
    if (!timetable) return;

    setTimetable(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weekdays: prev.weekdays.includes(dayId)
          ? prev.weekdays.filter(id => id !== dayId)
          : [...prev.weekdays, dayId]
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-content-light">Laadin...</div>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-content-light">Tunniplaani ei leitud</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-content mb-1">
                    Tunniplaani nimi
                    <span className="text-warning ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={timetable.name}
                    onChange={e => setTimetable(prev => prev ? { ...prev, name: e.target.value } : prev)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-content mb-1">
                      Kehtiv alates
                      <span className="text-warning ml-0.5">*</span>
                    </label>
                    <input
                      type="date"
                      value={timetable.valid_from}
                      onChange={e => setTimetable(prev => prev ? { ...prev, valid_from: e.target.value } : prev)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content mb-1">
                      Kehtiv kuni
                    </label>
                    <input
                      type="date"
                      value={timetable.valid_until || ''}
                      onChange={e => setTimetable(prev => prev ? { ...prev, valid_until: e.target.value || null } : prev)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content mb-2">
                    Nädalapäevad
                    <span className="text-warning ml-0.5">*</span>
                  </label>
                  <div className="flex gap-2">
                    {WEEKDAYS.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleWeekdayToggle(day.id)}
                        className={`
                          w-9 h-9 rounded-lg font-medium text-sm
                          ${timetable.weekdays.includes(day.id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-content-light hover:bg-gray-200'}
                        `}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {timetable.name}
                </h1>
                <div className="mt-1 text-content-light">
                  Kehtib: {new Date(timetable.valid_from).toLocaleDateString('et-EE')}
                  {timetable.valid_until && 
                    ` - ${new Date(timetable.valid_until).toLocaleDateString('et-EE')}`}
                </div>
                <div className="text-content-light">
                  Nädalapäevad: {timetable.weekdays.map(day => 
                    WEEKDAYS.find(w => w.id === day)?.label).join(', ')}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-content-light hover:text-content flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Tühista
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvesta
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-primary hover:text-primary-dark flex items-center gap-2"
                >
                  <Pencil className="w-5 h-5" />
                  Muuda
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Kustuta
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Events section */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-primary">Sündmused</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleAddFromTemplate}
                  className="px-4 py-2 text-primary hover:text-primary-dark flex items-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Lisa mallist
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Lisa sündmus
                </button>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-8 text-content-light">
                Ühtegi sündmust pole veel lisatud
              </div>
            ) : (
              <div className="space-y-2">
                {events
                  .sort((a, b) => a.event_time.localeCompare(b.event_time))
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-content-light">
                          {event.event_time}
                        </div>
                        <div className="text-content">
                          {event.event_name}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-content-light hover:text-content"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-content-light hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EventDialog
        isOpen={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelect={handleApplyTemplate}
      />
    </div>
  );
};

export default TimetableDetailView;
