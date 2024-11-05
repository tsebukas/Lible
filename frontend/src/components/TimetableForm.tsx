import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Save, X } from 'lucide-react';
import { timetables } from '../services/api';

const WEEKDAYS = [
  { id: 1, label: 'E' },
  { id: 2, label: 'T' },
  { id: 3, label: 'K' },
  { id: 4, label: 'N' },
  { id: 5, label: 'R' },
  { id: 6, label: 'L' },
  { id: 7, label: 'P' }
];

interface FormData {
  name: string;
  validFrom: string;
  validUntil: string;
  weekdays: number[];
}

interface FormErrors {
  name?: string;
  validFrom?: string;
  validUntil?: string;
  weekdays?: string;
}

const TimetableForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    weekdays: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nimi on kohustuslik';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nimi peab olema vähemalt 2 tähemärki pikk';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nimi võib olla maksimaalselt 100 tähemärki pikk';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'Alguskuupäev on kohustuslik';
    }

    if (formData.validUntil && formData.validFrom && 
        new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      newErrors.validUntil = 'Lõppkuupäev peab olema hilisem kui alguskuupäev';
    }

    if (formData.weekdays.length === 0) {
      newErrors.weekdays = 'Vähemalt üks nädalapäev peab olema valitud';
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
      // Convert weekdays from ISO format (1-7) to bitmask (0-6)
      const weekdaysBitmask = formData.weekdays
        .reduce((acc, day) => acc | (1 << (day - 1)), 0);
      
      await timetables.create({
        name: formData.name,
        valid_from: formData.validFrom,
        valid_until: formData.validUntil || null,
        weekdays: weekdaysBitmask
      });

      navigate('/timetables');
    } catch (error) {
      console.error('Error creating timetable:', error);
      setErrors({
        name: 'Tunniplaani salvestamine ebaõnnestus. Palun proovige uuesti.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWeekdayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(dayId)
        ? prev.weekdays.filter(id => id !== dayId)
        : [...prev.weekdays, dayId]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Uus tunniplaan
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Tunniplaani nimi
                <span className="text-warning ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Nt. Tavaline tunniplaan"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-warning">{errors.name}</p>
              )}
            </div>

            {/* Validity period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Kehtiv alates
                  <span className="text-warning ml-0.5">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={e => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {errors.validFrom && (
                  <p className="mt-1 text-sm text-warning">{errors.validFrom}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Kehtiv kuni
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={e => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {errors.validUntil && (
                  <p className="mt-1 text-sm text-warning">{errors.validUntil}</p>
                )}
              </div>
            </div>

            {/* Weekdays */}
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
                      ${formData.weekdays.includes(day.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-content-light hover:bg-gray-200'}
                    `}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.weekdays && (
                <p className="mt-1 text-sm text-warning">{errors.weekdays}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/timetables')}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;
