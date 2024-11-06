import { useState, useEffect } from 'react';
import { Clock, Music } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Select from './ui/Select';
import Alert from './ui/Alert';
import { appConfig } from '../config/app.config';
import { sounds as soundsApi, type Sound, type TimetableEvent } from '../services/api';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<TimetableEvent>) => Promise<void>;
  event?: Partial<TimetableEvent>;
  timetableId: number;
}

const EventDialog = ({ isOpen, onClose, onSave, event, timetableId }: EventDialogProps) => {
  const { t } = useLanguage();
  const toast = useToast();
  const [name, setName] = useState(event?.event_name || '');
  const [time, setTime] = useState(event?.event_time || '');
  const [soundId, setSoundId] = useState(event?.sound_id || 0);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      const toastId = toast.info(t('common.loading'), 0);
      
      try {
        const response = await soundsApi.getAll();
        setSounds(response);
        toast.removeToast(toastId);
      } catch (error) {
        toast.updateToast(toastId, {
          message: t('errors.loadSoundsFailed'),
          variant: 'error',
          duration: appConfig.toast.duration.error
        });
      }
    };

    if (isOpen) {
      loadSounds();
      // Reset form when dialog opens
      setName(event?.event_name || '');
      setTime(event?.event_time || '');
      setSoundId(event?.sound_id || 0);
      setErrors({});
    }
  }, [isOpen, event, t, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('validation.required');
    } else if (name.length < appConfig.validation.minNameLength) {
      newErrors.name = t('validation.minLength', { min: appConfig.validation.minNameLength });
    } else if (name.length > appConfig.validation.maxNameLength) {
      newErrors.name = t('validation.maxLength', { max: appConfig.validation.maxNameLength });
    }

    if (!time) {
      newErrors.time = t('validation.required');
    }

    if (!soundId) {
      newErrors.sound = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const toastId = toast.info(t('event.validating'), 0);

    try {
      // Uuenda toasti valideerimise olekuga
      toast.updateToast(toastId, {
        message: t('event.processing'),
        variant: 'info'
      });

      // Uuenda toasti salvestamise olekuga
      toast.updateToast(toastId, {
        message: t('event.saving'),
        variant: 'info'
      });

      await onSave({
        id: event?.id,
        event_name: name,
        event_time: time,
        sound_id: soundId,
        timetable_id: timetableId
      });

      // Uuenda toasti õnnestumise olekuga
      toast.updateToast(toastId, {
        message: event?.id ? t('event.updateSuccess') : t('event.createSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });

      onClose();
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={event?.id ? t('event.edit') : t('event.new')}
      footer={
        <Dialog.Footer.Buttons
          onCancel={onClose}
          onConfirm={handleSubmit}
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-4">
        <Input
          id="event-name"
          label={t('event.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
          fullWidth
        />

        <Input
          id="event-time"
          type="time"
          label={t('event.time')}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          error={errors.time}
          required
          fullWidth
          startIcon={<Clock className="h-5 w-5" />}
        />

        <Select
          id="event-sound"
          label={t('event.sound')}
          value={soundId}
          onChange={(value) => setSoundId(Number(value))}
          options={sounds.map(sound => ({
            value: sound.id,
            label: sound.name
          }))}
          error={errors.sound}
          required
          fullWidth
          startIcon={<Music className="h-5 w-5" />}
        />
      </div>
    </Dialog>
  );
};

export default EventDialog;
