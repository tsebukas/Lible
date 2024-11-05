import React, { useState, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { sounds } from '../services/api';
import type { Sound, TimetableEvent } from '../types/api';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TimetableEvent, 'id' | 'timetable_id'>) => Promise<void>;
  event?: TimetableEvent;
}

interface FormData {
  event_name: string;
  event_time: string;
  sound_id: number;
}

interface FormErrors {
  event_name?: string;
  event_time?: string;
  sound_id?: string;
}

const EventDialog: React.FC<EventDialogProps> = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState<FormData>({
    event_name: '',
    event_time: '08:00',
    sound_id: 0
  });
  const [soundsList, setSoundsList] = useState<Sound[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load sounds list
    const loadSounds = async () => {
      try {
        const data = await sounds.getAll();
        setSoundsList(data);
        
        // Set default sound if available
        if (data.length > 0 && !event) {
          setFormData(prev => ({ ...prev, sound_id: data[0].id }));
        }
      } catch (err) {
        console.error('Error loading sounds:', err);
        setErrors(prev => ({ ...prev, sound_id: 'Helinate laadimine ebaõnnestus' }));
      }
    };

    if (isOpen) {
      loadSounds();
      
      // Set form data if editing existing event
      if (event) {
        setFormData({
          event_name: event.event_name,
          event_time: event.event_time,
          sound_id: event.sound_id
        });
      }
    }
  }, [isOpen, event]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.event_name.trim()) {
      newErrors.event_name = 'Sündmuse nimi on kohustuslik';
    } else if (formData.event_name.length < 2) {
      newErrors.event_name = 'Nimi peab olema vähemalt 2 tähemärki pikk';
    } else if (formData.event_name.length > 100) {
      newErrors.event_name = 'Nimi võib olla maksimaalselt 100 tähemärki pikk';
    }

    if (!formData.event_time) {
      newErrors.event_time = 'Kellaaeg on kohustuslik';
    }

    if (!formData.sound_id) {
      newErrors.sound_id = 'Helin on kohustuslik';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        template_instance_id: null,
        is_template_base: false
      });
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setErrors(prev => ({
        ...prev,
        event_name: 'Sündmuse salvestamine ebaõnnestus'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-primary flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            {event ? 'Muuda sündmust' : 'Lisa sündmus'}
          </h2>
          <button
            onClick={onClose}
            className="text-content-light hover:text-content"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Event name */}
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              Sündmuse nimi
              <span className="text-warning ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={formData.event_name}
              onChange={e => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary ${
                errors.event_name ? 'border-red-500' : ''
              }`}
              placeholder="Nt. 1. tund algab"
            />
            {errors.event_name && (
              <p className="mt-1 text-sm text-red-500">{errors.event_name}</p>
            )}
          </div>

          {/* Event time */}
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              Kellaaeg
              <span className="text-warning ml-0.5">*</span>
            </label>
            <input
              type="time"
              value={formData.event_time}
              onChange={e => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary ${
                errors.event_time ? 'border-red-500' : ''
              }`}
            />
            {errors.event_time && (
              <p className="mt-1 text-sm text-red-500">{errors.event_time}</p>
            )}
          </div>

          {/* Sound selection */}
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              Helin
              <span className="text-warning ml-0.5">*</span>
            </label>
            <select
              value={formData.sound_id}
              onChange={e => setFormData(prev => ({ ...prev, sound_id: parseInt(e.target.value) }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary ${
                errors.sound_id ? 'border-red-500' : ''
              }`}
            >
              <option value="0" disabled>Vali helin</option>
              {soundsList.map(sound => (
                <option key={sound.id} value={sound.id}>
                  {sound.name}
                </option>
              ))}
            </select>
            {errors.sound_id && (
              <p className="mt-1 text-sm text-red-500">{errors.sound_id}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-content-light hover:text-content flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Tühista
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Salvesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventDialog;
