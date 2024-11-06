import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Alert from './ui/Alert';
import { appConfig } from '../config/app.config';
import { timetables, type Timetable } from '../services/api';

interface WeekdayOption {
  value: number;
  label: string;
  shortLabel: string;
}

const TimetableForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    valid_from: '',
    valid_until: '',
    weekdays: [] as number[]
  });

  // Nädalapäevade valikud
  const weekdayOptions: WeekdayOption[] = [
    { value: 1, label: t('common.weekdayLong.1'), shortLabel: t('common.weekdayShort.1') },
    { value: 2, label: t('common.weekdayLong.2'), shortLabel: t('common.weekdayShort.2') },
    { value: 3, label: t('common.weekdayLong.3'), shortLabel: t('common.weekdayShort.3') },
    { value: 4, label: t('common.weekdayLong.4'), shortLabel: t('common.weekdayShort.4') },
    { value: 5, label: t('common.weekdayLong.5'), shortLabel: t('common.weekdayShort.5') },
    { value: 6, label: t('common.weekdayLong.6'), shortLabel: t('common.weekdayShort.6') },
    { value: 7, label: t('common.weekdayLong.7'), shortLabel: t('common.weekdayShort.7') }
  ];

  const toggleWeekday = (value: number) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(value)
        ? prev.weekdays.filter(day => day !== value)
        : [...prev.weekdays, value].sort()
    }));
    // Clear weekday error when selection changes
    if (errors.weekdays) {
      setErrors(prev => ({ ...prev, weekdays: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    } else if (formData.name.length < appConfig.validation.minNameLength) {
      newErrors.name = t('validation.minLength', { min: appConfig.validation.minNameLength });
    } else if (formData.name.length > appConfig.validation.maxNameLength) {
      newErrors.name = t('validation.maxLength', { max: appConfig.validation.maxNameLength });
    }

    if (!formData.valid_from) {
      newErrors.valid_from = t('validation.required');
    }

    if (formData.valid_from && formData.valid_until && 
        new Date(formData.valid_from) >= new Date(formData.valid_until)) {
      newErrors.valid_until = t('validation.dateRange');
    }

    if (formData.weekdays.length === 0) {
      newErrors.weekdays = t('validation.noWeekdays');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const toastId = toast.info(t('timetable.saving'), 0);

    try {
      // Uuenda toasti valideerimise olekuga
      toast.updateToast(toastId, {
        message: t('timetable.validating'),
        variant: 'info'
      });

      // Konverdi nädalapäevad bitmask'iks
      const weekdaysBitmask = formData.weekdays.reduce(
        (acc, day) => acc + Math.pow(2, day - 1),
        0
      );

      // Uuenda toasti salvestamise olekuga
      toast.updateToast(toastId, {
        message: t('timetable.saving'),
        variant: 'info'
      });

      await timetables.create({
        name: formData.name,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        weekdays: weekdaysBitmask
      });

      // Uuenda toasti õnnestumise olekuga
      toast.updateToast(toastId, {
        message: t('timetable.createSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });

      navigate('/timetables');
    } catch (error) {
      // Uuenda toasti vea olekuga
      toast.updateToast(toastId, {
        message: t('errors.saveFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('timetable.new')}</Card.Title>
      </Card.Header>

      <form onSubmit={handleSubmit}>
        <Card.Content>
          <div className="space-y-6">
            <Input
              id="timetable-name"
              label={t('timetable.name')}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name}
              required
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="valid-from"
                type="date"
                label={t('timetable.validFrom')}
                value={formData.valid_from}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                error={errors.valid_from}
                required
                fullWidth
                startIcon={<Calendar className="h-5 w-5" />}
              />

              <Input
                id="valid-until"
                type="date"
                label={t('timetable.validUntil')}
                value={formData.valid_until}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                error={errors.valid_until}
                fullWidth
                startIcon={<Calendar className="h-5 w-5" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-content-light mb-2">
                {t('timetable.weekdays')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="flex flex-wrap gap-2">
                {weekdayOptions.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={formData.weekdays.includes(day.value) ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => toggleWeekday(day.value)}
                    title={day.label}
                  >
                    {day.shortLabel}
                  </Button>
                ))}
              </div>

              {errors.weekdays && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.weekdays}
                </p>
              )}
            </div>
          </div>
        </Card.Content>

        <Card.Footer>
          <Card.Actions>
            <Button
              variant="outline"
              onClick={() => navigate('/timetables')}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              {t('common.save')}
            </Button>
          </Card.Actions>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default TimetableForm;
