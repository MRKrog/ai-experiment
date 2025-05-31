import React from 'react';
import { BaseDialog } from '../../../common/Dialog/BaseDialog';
import { Button } from '../../../common/Button';
import { PriorityBadge, StatusBadge } from '../../../common/Badge';
import type { DialogSuggestion } from '../../../../types/suggestion.types';

interface ContentDialogProps {
  suggestion: DialogSuggestion;
  isOpen: boolean;
  onClose: () => void;
  onStartProcess: (suggestion: DialogSuggestion) => void;
}

export const ContentDialog: React.FC<ContentDialogProps> = ({
  suggestion,
  isOpen,
  onClose,
  onStartProcess
}) => {
  const renderFooter = () => (
    <div className="flex justify-end gap-3">
      <Button
        variant="ghost"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={() => onStartProcess(suggestion)}
      >
        Start Generation
      </Button>
    </div>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Content"
      footer={renderFooter()}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Theme
          </label>
          <p className="text-gray-100">{suggestion.theme}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description
          </label>
          <p className="text-gray-100">{suggestion.description}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Priority
            </label>
            <PriorityBadge priority={suggestion.priority} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <StatusBadge status={suggestion.status} />
          </div>
        </div>

        {suggestion.prompt && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Prompt
            </label>
            <p className="text-gray-100">{suggestion.prompt}</p>
          </div>
        )}
      </div>
    </BaseDialog>
  );
};

export default ContentDialog; 