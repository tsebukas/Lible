import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Pencil } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Alert from './ui/Alert';
import LoadingSpinner from './ui/LoadingSpinner';
import { appConfig } from '../config/app.config';
import { holidays as holidaysApi, type Holiday, type CreateHolidayInput } from '../services/api';

interface FormState {
  name: string;
  valid_from: string;
  valid_until: string;
  isLoading: boolean;
  error: string;
}

const HolidaysView = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Holiday | null>(null);
  const [editDialog, setEditDialog] = useState<Holiday | null>(null);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    valid_from: '',
    valid_until: '',
    isLoading: false,
    error: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await holidaysApi.getAll();
      setHolidays(response);
    } catch (error) {
      setError(t('errors.loadFailed'));
      toast.error(t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Kui editDialog muutub, seadista formState
    if (editDialog) {
      setFormState({
        name: editDialog.name,
        valid_from: editDialog.valid_from,
        valid_until: editDialog.valid_until,
        isLoading: false,
        error: ''
      });
    } else {
      // Reset form kui dialoog suletakse
      setFormState({
        name: '',
        valid_from: '',
        valid_until: '',
        isLoading: false,
        error: ''
      });
    }
  }, [editDialog]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = t('validation.required');
    } else if (formState.name.length < appConfig.validation.minNameLength) {
      newErrors.name = t('validation.minLength', { min: appConfig.validation.minNameLength });
    } else if (formState.name.length > appConfig.validation.maxNameLength) {
      newErrors.name = t('validation.maxLength', { max: appConfig.validation.maxNameLength });
    }

    if (!formState.valid_from) {
      newErrors.valid_from = t('validation.required');
    }

    if (!formState.valid_until) {
      newErrors.valid_until = t('validation.required');
    }

    if (formState.valid_from && formState.valid_until && 
        new Date(formState.valid_from) >= new Date(formState.valid_until)) {
      newErrors.valid_until = t('validation.dateRange');
    }

    if (Object.keys(newErrors).length > 0) {
      setFormState(prev => ({ ...prev, error: Object.values(newErrors)[0] }));
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('holiday.creating'), 0);

    try {
      const holidayData: CreateHolidayInput = {
        name: formState.name,
        valid_from: formState.valid_from,
        valid_until: formState.valid_until
      };

      await holidaysApi.create(holidayData);
      await loadData();
      setCreateDialog(false);
      
      toast.updateToast(toastId, {
        message: t('holiday.createSuccess'),
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
    const toastId = toast.info(t('holiday.saving'), 0);

    try {
      await holidaysApi.update(editDialog.id, {
        name: formState.name,
        valid_from: formState.valid_from,
        valid_until: formState.valid_until
      });
      await loadData();
      setEditDialog(null);
      
      toast.updateToast(toastId, {
        message: t('holiday.updateSuccess'),
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

  const handleDelete = async (holiday: Holiday) => {
    const toastId = toast.info(t('holiday.deleting'), 0);

    try {
      await holidaysApi.delete(holiday.id);
      await loadData();
      setDeleteDialog(null);
      
      toast.updateToast(toastId, {
        message: t('holiday.deleteSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      toast.updateToast(toastId, {
        message: t('errors.deleteFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner.Section />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          {t('holiday.title')}
        </h1>
        <Button
          onClick={() => setCreateDialog(true)}
          startIcon={<Plus className="h-5 w-5" />}
        >
          {t('holiday.new')}
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <Alert.Error onClose={() => setError(null)}>
          {error}
        </Alert.Error>
      )}

      {/* Holidays list */}
      <div className="grid gap-4">
        {holidays.length === 0 ? (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-content-light" />
                <p className="mt-2 text-content-light">
                  {t('holiday.noHolidays')}
                </p>
              </div>
            </Card.Content>
          </Card>
        ) : (
          holidays.map((holiday) => (
            <Card key={holiday.id}>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-content-light" />
                      <span className="font-medium">{holiday.name}</span>
                    </div>
                    <div className="mt-2 text-sm text-content-light">
                      {new Date(holiday.valid_from).toLocaleDateString('et-EE')} - {new Date(holiday.valid_until).toLocaleDateString('et-EE')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog(holiday)}
                      startIcon={<Pencil className="h-4 w-4" />}
                      title={t('holiday.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(holiday)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                      title={t('holiday.delete')}
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit dialog */}
      <Dialog
        isOpen={createDialog || !!editDialog}
        onClose={() => (createDialog ? setCreateDialog(false) : setEditDialog(null))}
        title={createDialog ? t('holiday.new') : t('holiday.edit')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => (createDialog ? setCreateDialog(false) : setEditDialog(null))}
            onConfirm={createDialog ? handleCreate : handleEdit}
            isLoading={formState.isLoading}
          />
        }
      >
        <div className="space-y-4">
          {formState.error && (
            <Alert.Error>
              {formState.error}
            </Alert.Error>
          )}

          <Input
            label={t('holiday.name')}
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            required
            fullWidth
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label={t('holiday.validFrom')}
              value={formState.valid_from}
              onChange={(e) => setFormState(prev => ({ ...prev, valid_from: e.target.value }))}
              required
              fullWidth
            />

            <Input
              type="date"
              label={t('holiday.validUntil')}
              value={formState.valid_until}
              onChange={(e) => setFormState(prev => ({ ...prev, valid_until: e.target.value }))}
              required
              fullWidth
            />
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        title={t('holiday.delete')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => setDeleteDialog(null)}
            onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
            confirmText={t('common.delete')}
          />
        }
      >
        <p>{t('holiday.deleteConfirm')}</p>
      </Dialog>
    </div>
  );
};

export default HolidaysView;
