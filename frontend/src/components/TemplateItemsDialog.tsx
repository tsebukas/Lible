import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Alert from './ui/Alert';
import AudioPlayButton from './ui/AudioPlayButton';
import { appConfig } from '../config/app.config';
import { Sound, CreateTemplateItemInput } from '../services/api';

interface TemplateItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CreateTemplateItemInput[];
  onChange: (items: CreateTemplateItemInput[]) => void;
  sounds: Sound[];
}

interface ItemFormData {
  event_name: string;
  offset_minutes: number;
  sound_id: number;
}

const TemplateItemsDialog = ({
  isOpen,
  onClose,
  items,
  onChange,
  sounds
}: TemplateItemsDialogProps) => {
  const { t } = useLanguage();
  const toast = useToast();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    event_name: '',
    offset_minutes: 0,
    sound_id: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hangi JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem(appConfig.auth.tokenKey);
    return token ? { 'Authorization': `Bearer ${token}` } : undefined;
  };

  const resetForm = () => {
    setFormData({
      event_name: '',
      offset_minutes: 0,
      sound_id: 0
    });
    setErrors({});
    setSelectedItem(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.event_name.trim()) {
      newErrors.event_name = t('validation.required');
    }

    if (!formData.sound_id) {
      newErrors.sound_id = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const newItems = [...items, formData];
    onChange(newItems);
    resetForm();
    toast.info(t('template.items.createSuccess'));
  };

  const handleEdit = () => {
    if (!validateForm() || selectedItem === null) return;

    const newItems = items.map((item, index) =>
      index === selectedItem ? formData : item
    );
    onChange(newItems);
    resetForm();
    toast.info(t('template.items.updateSuccess'));
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
    toast.info(t('template.items.deleteSuccess'));
  };

  const handleEditClick = (index: number) => {
    const item = items[index];
    setFormData({
      event_name: item.event_name,
      offset_minutes: item.offset_minutes,
      sound_id: item.sound_id
    });
    setSelectedItem(index);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('template.items.title')}
      size="lg"
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="space-y-4">
          <Input
            label={t('template.items.name')}
            value={formData.event_name}
            onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
            error={errors.event_name}
            required
            fullWidth
          />

          <Input
            type="number"
            label={t('template.items.offset')}
            value={formData.offset_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, offset_minutes: parseInt(e.target.value) }))}
            helperText={t('template.items.offsetHelp')}
            required
            fullWidth
          />

          <Select
            label={t('template.items.sound')}
            value={formData.sound_id}
            onChange={(value) => setFormData(prev => ({ ...prev, sound_id: Number(value) }))}
            options={sounds.map(sound => ({
              value: sound.id,
              label: sound.name
            }))}
            error={errors.sound_id}
            required
            fullWidth
          />

          <div className="flex justify-end">
            {selectedItem !== null ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="mr-2"
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleEdit}>
                  {t('common.save')}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAdd}
                startIcon={<Plus className="h-5 w-5" />}
              >
                {t('template.items.new')}
              </Button>
            )}
          </div>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          <h3 className="font-medium text-content">
            {t('template.items.title')} ({items.length})
          </h3>
          
          {items.length === 0 ? (
            <p className="text-content-light text-sm py-4 text-center">
              {t('template.items.noItems')}
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-content-light">
                      {item.offset_minutes >= 0 ? '+' : ''}{item.offset_minutes} min
                    </div>
                    <div className="text-content">
                      {item.event_name}
                    </div>
                    <div className="text-content-light text-sm">
                      ({sounds.find(s => s.id === item.sound_id)?.name})
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AudioPlayButton
                      variant="ghost"
                      size="sm"
                      url={`${appConfig.api.baseUrl}/sounds/${item.sound_id}`}
                      headers={getAuthHeaders()}
                      onPlayStateChange={(isPlaying) => setCurrentlyPlaying(isPlaying ? item.sound_id : null)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(index)}
                      startIcon={<Pencil className="h-4 w-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(index)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    </Dialog>
  );
};

export default TemplateItemsDialog;
