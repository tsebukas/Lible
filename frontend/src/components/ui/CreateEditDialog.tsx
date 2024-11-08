import Dialog from './Dialog';
import Alert from './Alert';
import Input from './Input';

interface CreateEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
  isLoading: boolean;
  error: string;
  fields: Array<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type?: string;
    fullWidth?: boolean;
  }>;
}

const CreateEditDialog: React.FC<CreateEditDialogProps> = ({
  isOpen,
  onClose,
  title,
  onConfirm,
  isLoading,
  error,
  fields
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <Dialog.Footer.Buttons
          onCancel={onClose}
          onConfirm={onConfirm}
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-4">
        {error && (
          <Alert.Error>
            {error}
          </Alert.Error>
        )}
        {fields.map((field, index) => (
          <Input
            key={index}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            type={field.type}
            fullWidth={field.fullWidth}
          />
        ))}
      </div>
    </Dialog>
  );
};

export default CreateEditDialog;
