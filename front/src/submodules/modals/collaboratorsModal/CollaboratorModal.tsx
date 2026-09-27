import { CollaboratorForm } from './CollaboratorForm';
import type { CollaboratorFormData } from './collaborator.types';
import type { ThemeMode } from '../../../styles/theme';

interface CollaboratorModalProps {
  isOpen: boolean;
  themeMode?: ThemeMode;
  onClose: () => void;
  onSubmit: (data: CollaboratorFormData) => void;
}

export default function CollaboratorModal({ isOpen, themeMode = 'dark', onClose, onSubmit }: CollaboratorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-all">
      <CollaboratorForm themeMode={themeMode} onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}