import { useState, useEffect } from 'react';
import { Music, Upload, Trash2, Pencil } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Alert from './ui/Alert';
import LoadingSpinner from './ui/LoadingSpinner';
import AudioPlayButton from './ui/AudioPlayButton';
import { appConfig } from '../config/app.config';
import { sounds as soundsApi, type Sound } from '../services/api';
import CreateEditDialog from './ui/CreateEditDialog';
import { getAuthHeaders } from '../utils/auth';

const SoundsView = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Sound | null>(null);
  const [editDialog, setEditDialog] = useState<Sound | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  useEffect(() => {
    loadSounds();
  }, []);

  const loadSounds = async () => {
    try {
      const response = await soundsApi.getAll();
      setSounds(response);
    } catch (error) {
      setError(t('errors.loadFailed'));
      toast.error(t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const [uploadState, setUploadState] = useState({
    name: '',
    file: null as File | null,
    isLoading: false,
    error: ''
  });

  const [editState, setEditState] = useState({
    name: '',
    isLoading: false,
    error: ''
  });

  useEffect(() => {
    // Kui editDialog muutub, seadista editState
    if (editDialog) {
      setEditState(prev => ({
        ...prev,
        name: editDialog.name,
        error: ''
      }));
    }
  }, [editDialog]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > appConfig.upload.maxFileSize) {
      setUploadState(prev => ({
        ...prev,
        error: t('validation.soundTooLarge')
      }));
      return;
    }

    if (!appConfig.upload.allowedSoundTypes.includes(file.type)) {
      setUploadState(prev => ({
        ...prev,
        error: t('validation.invalidFileType')
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      file,
      error: ''
    }));
  };

  const handleUpload = async () => {
    if (!uploadState.file || !uploadState.name.trim()) return;

    setUploadState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('sound.uploading'), 0);

    try {
      const formData = new FormData();
      formData.append('sound_file', uploadState.file);
      formData.append('name', uploadState.name);

      await soundsApi.upload(formData);
      await loadSounds();
      setUploadDialog(false);
      
      toast.updateToast(toastId, {
        message: t('sound.uploadSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState(prev => ({
        ...prev,
        error: t('errors.uploadFailed')
      }));
      
      toast.updateToast(toastId, {
        message: t('errors.uploadFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setUploadState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleEdit = async () => {
    if (!editDialog || !editState.name.trim()) return;

    setEditState(prev => ({ ...prev, isLoading: true, error: '' }));
    const toastId = toast.info(t('sound.saving'), 0);

    try {
      await soundsApi.update(editDialog.id, { name: editState.name });
      await loadSounds();
      setEditDialog(null);
      
      toast.updateToast(toastId, {
        message: t('sound.updateSuccess'),
        variant: 'success',
        duration: appConfig.toast.duration.success
      });
    } catch (error) {
      console.error('Update error:', error);
      setEditState(prev => ({
        ...prev,
        error: t('errors.saveFailed')
      }));
      
      toast.updateToast(toastId, {
        message: t('errors.saveFailed'),
        variant: 'error',
        duration: appConfig.toast.duration.error
      });
    } finally {
      setEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (sound: Sound) => {
    const toastId = toast.info(t('sound.deleting'), 0);

    try {
      await soundsApi.delete(sound.id);
      await loadSounds();
      setDeleteDialog(null);
      
      toast.updateToast(toastId, {
        message: t('sound.deleteSuccess'),
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

  const editDialogFields = [
    {
      label: t('sound.name'),
      value: editState.name,
      onChange: (e) => setEditState(prev => ({ ...prev, name: e.target.value })),
      required: true,
      fullWidth: true
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
          <Music className="w-6 h-6" />
          {t('sound.title')}
        </h1>
        <Button
          onClick={() => setUploadDialog(true)}
          startIcon={<Upload className="h-5 w-5" />}
        >
          {t('sound.new')}
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <Alert.Error onClose={() => setError(null)}>
          {error}
        </Alert.Error>
      )}

      {/* Sounds list */}
      <div className="grid gap-4">
        {sounds.length === 0 ? (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <Music className="mx-auto h-12 w-12 text-content-light" />
                <p className="mt-2 text-content-light">
                  {t('sound.noSounds')}
                </p>
              </div>
            </Card.Content>
          </Card>
        ) : (
          sounds.map((sound) => (
            <Card key={sound.id}>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-content-light" />
                    <span className="font-medium">{sound.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioPlayButton
                      variant="ghost"
                      size="sm"
                      url={`${appConfig.api.baseUrl}/sounds/${sound.id}`}
                      headers={getAuthHeaders()}
                      onPlayStateChange={(isPlaying) => setCurrentlyPlaying(isPlaying ? sound.id : null)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditDialog(sound)}
                      startIcon={<Pencil className="h-4 w-4" />}
                      title={t('sound.edit')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(sound)}
                      startIcon={<Trash2 className="h-4 w-4" />}
                      title={t('sound.delete')}
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>

      {/* Upload dialog */}
      <Dialog
        isOpen={uploadDialog}
        onClose={() => setUploadDialog(false)}
        title={t('sound.new')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => setUploadDialog(false)}
            onConfirm={handleUpload}
            isLoading={uploadState.isLoading}
          />
        }
      >
        <div className="space-y-4">
          {uploadState.error && (
            <Alert.Error>
              {uploadState.error}
            </Alert.Error>
          )}

          <Input
            label={t('sound.name')}
            value={uploadState.name}
            onChange={(e) => setUploadState(prev => ({ ...prev, name: e.target.value }))}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-content-light mb-1">
              {t('sound.file')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleFileSelect}
              className="block w-full text-sm text-content-light
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-white
                hover:file:bg-primary-dark"
            />
          </div>
        </div>
      </Dialog>

      {/* Edit dialog */}
      <CreateEditDialog
        isOpen={!!editDialog}
        onClose={() => setEditDialog(null)}
        title={t('sound.edit')}
        onConfirm={handleEdit}
        isLoading={editState.isLoading}
        error={editState.error}
        fields={editDialogFields}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        title={t('sound.delete')}
        footer={
          <Dialog.Footer.Buttons
            onCancel={() => setDeleteDialog(null)}
            onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
            confirmText={t('common.delete')}
          />
        }
      >
        <p>{t('sound.deleteConfirm')}</p>
      </Dialog>
    </div>
  );
};

export default SoundsView;
