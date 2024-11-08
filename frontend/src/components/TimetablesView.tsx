import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Pencil, Trash2, FileTerminal } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Alert from './ui/Alert';
import Dialog from './ui/Dialog';
import LoadingSpinner from './ui/LoadingSpinner';
import CreateEditDialog from './ui/CreateEditDialog';
import TimetableEventsDialog from './TimetableEventsDialog';
import { appConfig } from '../config/app.config';
import { timetables, sounds as soundsApi } from '../services/api';
import type { Timetable, Sound } from '../types/api';

interface FormState {
  name: string;
  valid_from: string;
  valid_until: string;
  weekdays: number[];
  isLoading: boolean;
  error: string;
}

const WEEKDAYS = [
  { value: 1, label: 'E' },
  { value: 2, label: 'T' },
  { value: 3, label: 'K' },
  { value: 4, label: 'N' },
  { value: 5, label: 'R' },
  { value: 6, label: 'L' },
  { value: 7, label: 'P' }
];

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
    .map(day => day.label)
    .join(', ');
};

const TimetablesView: React.FC = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [timetableList, setTimetableList] = useState<Timetable[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<Timetable | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Timetable | null>(null);
  const [eventsDialog, setEventsDialog] = useState<number | null>(null);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    valid_from: '',
    valid_until: '',
    weekdays: [],
    isLoading: false,
    error: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [timetablesData, soundsData] = await Promise.all([
        timetables.getAll(),
        soundsApi.getAll()
      ]);
      setTimetableList(timetablesData);
      setSounds(soundsData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('errors.loadFailed'));
      toast.error(t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Kui editDialog muutub, seadista formState
    if (editDialog) {
      // Convert bitmask to array of weekday numbers
      const weekdaysArray = WEEKDAYS
        .filter((_, index) => editDialog.weekdays & (1 << index))
        .map(day => day.value);

      setFormState({
        name: editDialog.name,
        valid_from: editDialog.valid_from,
        valid_until: editDialog.valid_until || '',
        weekdays: weekdaysArray,
        isLoading: false,
        error: ''
      });
    } else {
      // Reset form kui dialoog suletakse
      setFormState({
        name: '',
        valid_from: '',
        valid_until: '',
        weekdays: [],
        isLoading: false,
        error: ''
      });
    }
  }, [editDialog]);

  const handleCreate = async () => {
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('timetable.saving'), 0);

    try {
      // Convert weekdays array to bitmask
      const weekdaysBitmask = formState.weekdays
        .reduce((acc, day) => acc | (1 << (day - 1)), 0);

      await timetables.create({
        name: formState.name,
        valid_from: formState.valid_from,
        valid_until: formState.valid_until || null,
        weekdays: weekdaysBitmask
      });
      await loadData();
      setCreateDialog(false);
      
      toast.updateToast(toastId, {
        message: t('timetable.createSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Create error:', error);
      setFormState(prev => ({
        ...prev,
        error: t('errors.saveFailed')
      }));
      
      toast.updateToast(toastId, {
        message: t('errors.saveFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEdit = async () => {
    if (!editDialog || !validateForm()) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('timetable.saving'), 0);

    try {
      // Convert weekdays array to bitmask
      const weekdaysBitmask = formState.weekdays
        .reduce((acc, day) => acc | (1 << (day - 1)), 0);

      await timetables.update(editDialog.id, {
        name: formState.name,
        valid_from: formState.valid_from,
        valid_until: formState.valid_until || null,
        weekdays: weekdaysBitmask
      });
      await loadData();
      setEditDialog(null);
      
      toast.updateToast(toastId, {
        message: t('timetable.updateSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Update error:', error);
      setFormState(prev => ({
        ...prev,
        error: t('errors.saveFailed')
      }));
      
      toast.updateToast(toastId, {
        message: t('errors.saveFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (timetable: Timetable) => {
    const toastId = toast.info(t('timetable.deleting'), 0);

    try {
      await timetables.delete(timetable.id);
      await loadData();
      setDeleteDialog(null);
      
      toast.updateToast(toastId, {
        message: t('timetable.deleteSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.updateToast(toastId, {
        message: t('errors.deleteFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formState.name.trim()) {
      newErrors.push(t('validation.required'));
    } else if (formState.name.length < appConfig.validation.minNameLength) {
      newErrors.push(t('validation.minLength', { min: appConfig.validation.minNameLength }));
    } else if (formState.name.length > appConfig.validation.maxNameLength) {
      newErrors.push(t('validation.maxLength', { max: appConfig.validation.maxNameLength }));
    }

    if (!formState.valid_from) {
      newErrors.push(t('validation.required'));
    }

    if (formState.valid_from && formState.valid_until && 
        new Date(formState.valid_from) >= new Date(formState.valid_until)) {
      newErrors.push(t('validation.dateRange'));
    }

    if (formState.weekdays.length === 0) {
      newErrors.push(t('validation.noWeekdays'));
    }

    if (newErrors.length > 0) {
      setFormState(prev => ({ ...prev, error: newErrors[0] }));
      return false;
    }

    return true;
  };

  const dialogFields = [
    {
      label: t('timetable.name'),
      value: formState.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFormState(prev => ({ ...prev, name: e.target.value })),
      required: true,
      fullWidth: true
    },
    {
      label: t('timetable.validFrom'),
      value: formState.valid_from,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFormState(prev => ({ ...prev, valid_from: e.target.value })),
      required: true,
      type: 'date',
      fullWidth: true
    },
    {
      label: t('timetable.validUntil'),
      value: formState.valid_until,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFormState(prev => ({ ...prev, valid_until: e.target.value })),
      type: 'date',
      fullWidth: true
    },
    {
      label: t('timetable.weekdays'),
      value: '',
      onChange: () => {},
      required: true,
      fullWidth: true,
      customContent: (
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => (
            <Button
              key={day.value}
              type="button"
              variant={formState.weekdays.includes(day.value) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setFormState(prev => ({
                  ...prev,
                  weekdays: prev.weekdays.includes(day.value)
                    ? prev.weekdays.filter(d => d !== day.value)
                    : [...prev.weekdays, day.value].sort()
                }));
              }}
              title={t(`common.weekdayLong.${day.value}`)}
            >
              {day.label}
            </Button>
          ))}
        </div>
      )
    }
  ];

  if (isLoading) {
    return <LoadingSpinner.Section />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          {t('timetable.title')}
        </h1>
        <Button
          onClick={() => setCreateDialog(true)}
          startIcon={<Plus className="h-5 w-5" />}
        >
          {t('timetable.new')}
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <Alert.Error onClose={() => setError(null)}>
          {error}
        </Alert.Error>
      )}

      {/* Timetables list */}
      <div className="grid gap-4">
        {timetableList.length === 0 ? (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-content-light" />
                <p className="mt-2 text-content-light">
                  {t('timetable.noTimetables')}
                </p>
              </div>
            </Card.Content>
          </Card>
        ) : (
          timetableList.map((timetable) => (
            <Card key={timetable.id}>
              <Card.Content>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-2">
                      {timetable.name}
                    </h3>
                    <div className="text-sm text-content-light space-y-1">
                      <div>
                        {t('timetable.validPeriod')}: {formatDate(timetable.valid_from)}
                        {timetable.valid_until && ` - ${formatDate(timetable.valid_until)}`}
                      </div>
                      <div>{t('timetable.weekdays')}: {formatWeekdays(timetable.weekdays)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEventsDialog(timetable.id)}
                      startIcon={<FileTerminal className="h-4 w-4" />}
                      title={t('timetable.events.title')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog(timetable)}
                      startIcon={<Pencil className="h-4 w-4" />}
                      title={t('timetable.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(timetable)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                      title={t('timetable.delete')}
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit dialog */}
      <CreateEditDialog
        isOpen={createDialog || !!editDialog}
        onClose={() => (createDialog ? setCreateDialog(false) : setEditDialog(null))}
        title={createDialog ? t('timetable.new') : t('timetable.edit')}
        onConfirm={createDialog ? handleCreate : handleEdit}
        isLoading={formState.isLoading}
        error={formState.error}
        fields={dialogFields}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        title={t('timetable.delete')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => setDeleteDialog(null)}
            onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
            confirmText={t('common.delete')}
          />
        }
      >
        <p>{t('timetable.deleteConfirm')}</p>
      </Dialog>

      {/* Events dialog */}
      {eventsDialog !== null && (
        <TimetableEventsDialog
          isOpen={!!eventsDialog}
          onClose={() => setEventsDialog(null)}
          timetableId={eventsDialog}
        />
      )}
    </div>
  );
};

export default TimetablesView;
