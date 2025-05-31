import React from 'react';
import { Badge } from './Badge';
import type { Priority } from '../../../types/shared.types';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getVariant = () => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant()}>
      {priority}
    </Badge>
  );
};

export default PriorityBadge; 