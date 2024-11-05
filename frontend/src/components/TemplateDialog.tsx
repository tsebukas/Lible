import React, { useState, useEffect } from 'react';
import { Bell, Save, X } from 'lucide-react';
import { templates } from '../services/api';
import type { EventTemplate } from '../types/api';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: number, baseTime: string) => Promise<void>;
}

interface FormData {
  templateId: number;
  baseTime: string;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({ isOpen, onClose, onSelect }) => {
  const [formData, setFormData] = useState<FormData>({
    templateId: 0,
    baseTime: '08:00'
  });
  const [templatesList, setTemplatesList] = useState<EventTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await templates.getAll();
        setTemplatesList(data);
        
        // Set default template if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, templateId: data[0].id }));
        }
      } catch (err) {
        console.error('Error loading templates:', err);
        setError('Mallide laadimine ebaõnnestus');
      }
    };

    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.templateId) {
      setError('Mall on kohustuslik');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSelect(formData.templateId, formData.baseTime);
      onClose();
    } catch (err) {
      console.error('Error applying template:', err);
      setError('Malli rakendamine ebaõnnestus');
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
            <Bell className="w-5 h-5" />
            Lisa sündmused mallist
          </h2>
          <button
            onClick={onClose}
            className="text-content-light hover:text-content"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Template selection */}
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              Mall
              <span className="text-warning ml-0.5">*</span>
            </label>
            <select
              value={formData.templateId}
              onChange={e => setFormData(prev => ({ ...prev, templateId: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="0" disabled>Vali mall</option>
              {templatesList.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {formData.templateId > 0 && (
              <div className="mt-2 text-sm text-content-light">
                {templatesList.find(t => t.id === formData.templateId)?.description}
              </div>
            )}
          </div>

          {/* Base time */}
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              Põhisündmuse aeg
              <span className="text-warning ml-0.5">*</span>
            </label>
            <input
              type="time"
              value={formData.baseTime}
              onChange={e => setFormData(prev => ({ ...prev, baseTime: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Preview */}
          {formData.templateId > 0 && (
            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Sündmused
              </label>
              <div className="space-y-1 text-sm">
                {templatesList
                  .find(t => t.id === formData.templateId)
                  ?.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="text-content-light">
                        {item.offset_minutes >= 0 ? '+' : ''}{item.offset_minutes} min
                      </div>
                      <div className="text-content">
                        {item.event_name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

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
              Lisa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateDialog;
