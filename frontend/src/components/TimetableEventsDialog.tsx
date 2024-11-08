import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Clock } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Alert from './ui/Alert';
import AudioPlayButton from './ui/AudioPlayButton';
import { appConfig } from '../config/app.config';
import { 
  timetables, 
  templates, 
  sounds 
} from '../services/api';
import { 
  TimetableEvent, 
  EventTemplate, 
  Sound,
  CreateTemplateItemInput
} from '../types/api';

interface TimetableEventsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: number;
}

interface EventFormData {
  event_name: string;
  event_time: string;
  sound_id: number;
  is_template_base: boolean;
  template_instance_id: number | null;
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('et-EE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateTemplateEventTime = (baseTime: string, offsetMinutes: number): string => {
  const [hours, minutes] = baseTime.split(':').map(Number);
  const baseDate = new Date(2000, 0, 1, hours, minutes);
  const newDate = new Date(baseDate.getTime() + offsetMinutes * 60000);
  
  return newDate.toTimeString().slice(0, 5);
};

const TimetableEventsDialog = ({ 
  isOpen, 
  onClose, 
  timetableId 
}: TimetableEventsDialogProps) => {
  const { t } = useLanguage();
  const toast = useToast();
  
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [templatesList, setTemplatesList] = useState<EventTemplate[]>([]);
  const [soundsList, setSoundsList] = useState<Sound[]>([]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [baseEventTime, setBaseEventTime] = useState('');
  
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    event_name: '',
    event_time: '',
    sound_id: 0,
    is_template_base: false,
    template_instance_id: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedEvents, loadedTemplates, loadedSounds] = await Promise.all([
          timetables.getEvents(timetableId),
          templates.getAll(),
          sounds.getAll()
        ]);
        
        setEvents(loadedEvents.sort((a, b) => 
          new Date(`2000-01-01T${a.event_time}`).getTime() - 
          new Date(`2000-01-01T${b.event_time}`).getTime()
        ));
        setTemplatesList(loadedTemplates);
        setSoundsList(loadedSounds);
      } catch (error) {
        toast.error(t('errors.loadFailed'));
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, timetableId]);

  const resetForm = () => {
    setFormData({
      event_name: '',
      event_time: '',
      sound_id: 0,
      is_template_base: false,
      template_instance_id: null
    });
    setSelectedEvent(null);
    setSelectedTemplate(null);
    setBaseEventTime('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.event_name.trim()) {
      newErrors.event_name = t('validation.required');
    }

    if (!formData.event_time) {
      newErrors.event_time = t('validation.required');
    }

    if (!formData.sound_id) {
      newErrors.sound_id = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTemplateSelect = (templateId: number) => {
    const template = templatesList.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
    }
  };

  const handleBaseEventTimeChange = (time: string) => {
    setBaseEventTime(time);
  };

  const handleAddEvent = async () => {
    if (!validateForm()) return;

    try {
      const newEvent = await timetables.createEvent(timetableId, {
        event_name: formData.event_name,
        event_time: formData.event_time,
        sound_id: formData.sound_id,
        is_template_base: formData.is_template_base,
        template_instance_id: selectedTemplate
      });

      setEvents(prev => [...prev, newEvent].sort((a, b) => 
        new Date(`2000-01-01T${a.event_time}`).getTime() - 
        new Date(`2000-01-01T${b.event_time}`).getTime()
      ));
      
      resetForm();
      toast.success(t('timetable.events.createSuccess'));
    } catch (error) {
      toast.error(t('errors.saveFailed'));
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !validateForm()) return;

    try {
      const updatedEvent = await timetables.updateEvent(timetableId, selectedEvent, {
        event_name: formData.event_name,
        event_time: formData.event_time,
        sound_id: formData.sound_id,
        is_template_base: formData.is_template_base,
        template_instance_id: selectedTemplate
      });

      setEvents(prev => prev.map(event => 
        event.id === selectedEvent ? updatedEvent : event
      ).sort((a, b) => 
        new Date(`2000-01-01T${a.event_time}`).getTime() - 
        new Date(`2000-01-01T${b.event_time}`).getTime()
      ));
      
      resetForm();
      toast.success(t('timetable.events.updateSuccess'));
    } catch (error) {
      toast.error(t('errors.saveFailed'));
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await timetables.deleteEvent(timetableId, eventId);
      
      setEvents(prev => prev.filter(event => event.id !== eventId));
      resetForm();
      toast.success(t('timetable.events.deleteSuccess'));
    } catch (error) {
      toast.error(t('errors.deleteFailed'));
    }
  };

  const handleEditEvent = (event: TimetableEvent) => {
    setSelectedEvent(event.id);
    setFormData({
      event_name: event.event_name,
      event_time: event.event_time,
      sound_id: event.sound_id,
      is_template_base: event.is_template_base,
      template_instance_id: event.template_instance_id
    });
    
    if (event.template_instance_id) {
      setSelectedTemplate(event.template_instance_id);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('timetable.events.title')}
      size="xl"
    >
      <div className="space-y-6">
        {/* Template selection */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label={t('timetable.events.template')}
            value={selectedTemplate || ''}
            onChange={(value) => handleTemplateSelect(Number(value))}
            options={[
              { value: '', label: t('common.select') },
              ...templatesList.map(template => ({
                value: template.id,
                label: template.name
              }))
            ]}
            fullWidth
          />
          
          {selectedTemplate && (
            <Input
              label={t('timetable.events.baseEventTime')}
              type="time"
              value={baseEventTime}
              onChange={(e) => handleBaseEventTimeChange(e.target.value)}
              fullWidth
            />
          )}
        </div>

        {/* Event form */}
        <div className="space-y-4">
          <Input
            label={t('timetable.events.name')}
            value={formData.event_name}
            onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
            error={errors.event_name}
            required
            fullWidth
          />

          <Input
            label={t('timetable.events.time')}
            type="time"
            value={formData.event_time}
            onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
            error={errors.event_time}
            required
            fullWidth
          />

          <Select
            label={t('timetable.events.sound')}
            value={formData.sound_id}
            onChange={(value) => setFormData(prev => ({ ...prev, sound_id: Number(value) }))}
            options={soundsList.map(sound => ({
              value: sound.id,
              label: sound.name
            }))}
            error={errors.sound_id}
            required
            fullWidth
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_template_base"
              checked={formData.is_template_base}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                is_template_base: e.target.checked 
              }))}
            />
            <label htmlFor="is_template_base" className="text-sm text-content-light">
              {t('timetable.events.isBaseEvent')}
            </label>
          </div>

          <div className="flex justify-end">
            {selectedEvent !== null ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="mr-2"
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleUpdateEvent}>
                  {t('common.save')}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddEvent}
                startIcon={<Plus className="h-5 w-5" />}
              >
                {t('timetable.events.new')}
              </Button>
            )}
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-2">
          <h3 className="font-medium text-content">
            {t('timetable.events.title')} ({events.length})
          </h3>
          
          {events.length === 0 ? (
            <p className="text-content-light text-sm py-4 text-center">
              {t('timetable.events.noEvents')}
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-content-light">
                      <Clock className="h-5 w-5 inline-block mr-2" />
                      {formatTime(event.event_time)}
                    </div>
                    <div className="text-content">
                      {event.event_name}
                    </div>
                    <div className="text-content-light text-sm">
                      ({soundsList.find(s => s.id === event.sound_id)?.name})
                    </div>
                    {event.is_template_base && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                        {t('timetable.events.baseEvent')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <AudioPlayButton
                      variant="ghost"
                      size="sm"
                      url={`${appConfig.api.baseUrl}/sounds/${event.sound_id}`}
                      onPlayStateChange={() => {}}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      startIcon={<Pencil className="h-4 w-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default TimetableEventsDialog;
