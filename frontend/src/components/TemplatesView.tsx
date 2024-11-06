import { useState, useEffect } from 'react';
import { FileTerminal, Plus, Trash2, Pencil, FileText } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Alert from './ui/Alert';
import LoadingSpinner from './ui/LoadingSpinner';
import TemplateItemsDialog from './TemplateItemsDialog';
import { appConfig } from '../config/app.config';
import { templates as templatesApi, sounds as soundsApi, type EventTemplate, type CreateTemplateInput, type CreateTemplateItemInput, type Sound } from '../services/api';

interface FormState {
  name: string;
  description: string;
  items: CreateTemplateItemInput[];
  isLoading: boolean;
  error: string;
}

const TemplatesView = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<EventTemplate | null>(null);
  const [editDialog, setEditDialog] = useState<EventTemplate | null>(null);
  const [itemsDialog, setItemsDialog] = useState<EventTemplate | null>(null);
  const [dialogItems, setDialogItems] = useState<CreateTemplateItemInput[]>([]);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    description: '',
    items: [],
    isLoading: false,
    error: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesResponse, soundsResponse] = await Promise.all([
        templatesApi.getAll(),
        soundsApi.getAll()
      ]);
      setTemplates(templatesResponse);
      setSounds(soundsResponse);
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
        description: editDialog.description || '',
        items: editDialog.items.map(item => ({
          event_name: item.event_name,
          offset_minutes: item.offset_minutes,
          sound_id: item.sound_id
        })),
        isLoading: false,
        error: ''
      });
    } else {
      // Reset form kui dialoog suletakse
      setFormState({
        name: '',
        description: '',
        items: [],
        isLoading: false,
        error: ''
      });
    }
  }, [editDialog]);

  useEffect(() => {
    // Kui itemsDialog muutub, seadista dialogItems
    if (itemsDialog) {
      setDialogItems(itemsDialog.items.map(item => ({
        event_name: item.event_name,
        offset_minutes: item.offset_minutes,
        sound_id: item.sound_id
      })));
    } else {
      setDialogItems([]);
    }
  }, [itemsDialog]);

  const handleCreate = async () => {
    if (!formState.name.trim()) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('template.creating'), 0);

    try {
      const templateData: CreateTemplateInput = {
        name: formState.name,
        description: formState.description || null,
        items: formState.items
      };

      await templatesApi.create(templateData);
      await loadData();
      setCreateDialog(false);
      
      toast.updateToast(toastId, {
        message: t('template.createSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Create error:', error);
      setFormState(prev => ({
        ...prev,
        error: t('errors.createFailed')
      }));
      
      toast.updateToast(toastId, {
        message: t('errors.createFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEdit = async () => {
    if (!editDialog || !formState.name.trim()) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('template.saving'), 0);

    try {
      await templatesApi.update(editDialog.id, {
        name: formState.name,
        description: formState.description || null,
        items: formState.items
      });
      await loadData();
      setEditDialog(null);
      
      toast.updateToast(toastId, {
        message: t('template.updateSuccess'),
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

  const handleDelete = async (template: EventTemplate) => {
    const toastId = toast.info(t('template.deleting'), 0);

    try {
      await templatesApi.delete(template.id);
      await loadData();
      setDeleteDialog(null);
      
      toast.updateToast(toastId, {
        message: t('template.deleteSuccess'),
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

  const handleItemsChange = (items: CreateTemplateItemInput[]) => {
    setDialogItems(items);
    // Kui oleme muutmas olemasolevat malli
    if (itemsDialog) {
      setFormState(prev => ({ ...prev, items }));
    }
  };

  const handleItemsDialogClose = async () => {
    if (itemsDialog) {
      const toastId = toast.info(t('template.saving'), 0);

      try {
        await templatesApi.update(itemsDialog.id, {
          name: itemsDialog.name,
          description: itemsDialog.description,
          items: dialogItems
        });
        await loadData();
        
        toast.updateToast(toastId, {
          message: t('template.updateSuccess'),
          variant: 'success',
          duration: appConfig.toast.duration.success
        });
      } catch (error) {
        console.error('Update error:', error);
        toast.updateToast(toastId, {
          message: t('errors.saveFailed'),
          variant: 'error',
          duration: appConfig.toast.duration.error
        });
      }
    }
    setItemsDialog(null);
  };

  if (isLoading) {
    return <LoadingSpinner.Section />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FileText className="w-6 h-6" />
          {t('template.title')}
        </h1>
        <Button
          onClick={() => setCreateDialog(true)}
          startIcon={<Plus className="h-5 w-5" />}
        >
          {t('template.new')}
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <Alert.Error onClose={() => setError(null)}>
          {error}
        </Alert.Error>
      )}

      {/* Templates list */}
      <div className="grid gap-4">
        {templates.length === 0 ? (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-content-light" />
                <p className="mt-2 text-content-light">
                  {t('template.noTemplates')}
                </p>
              </div>
            </Card.Content>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-content-light" />
                      <span className="font-medium">{template.name}</span>
                    </div>
                    {template.description && (
                      <p className="mt-1 text-sm text-content-light">
                        {template.description}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-content-light">
                      {t('template.eventCount', { count: template.items.length })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setItemsDialog(template)}
                      startIcon={<FileTerminal className="h-4 w-4" />}
                      title={t('template.items.title')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog(template)}
                      startIcon={<Pencil className="h-4 w-4" />}
                      title={t('template.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(template)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                      title={t('template.delete')}
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
        title={createDialog ? t('template.new') : t('template.edit')}
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
            label={t('template.name')}
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            required
            fullWidth
          />

          <Input
            label={t('template.description')}
            value={formState.description}
            onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
          />
        </div>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        title={t('template.delete')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => setDeleteDialog(null)}
            onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
            confirmText={t('common.delete')}
          />
        }
      >
        <p>{t('template.deleteConfirm')}</p>
      </Dialog>

      {/* Items dialog */}
      {itemsDialog && (
        <TemplateItemsDialog
          isOpen={!!itemsDialog}
          onClose={handleItemsDialogClose}
          items={dialogItems}
          onChange={handleItemsChange}
          sounds={sounds}
        />
      )}
    </div>
  );
};

export default TemplatesView;
