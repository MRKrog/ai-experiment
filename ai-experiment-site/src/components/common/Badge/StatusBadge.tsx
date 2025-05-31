import React from 'react';
import { Badge } from './Badge';
import type { SuggestionStatus } from '../../../types/shared.types';

interface StatusBadgeProps {
  status: SuggestionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant()}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default StatusBadge; 