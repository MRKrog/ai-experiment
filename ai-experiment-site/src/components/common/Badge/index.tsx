import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-900/40 text-green-200',
  warning: 'bg-yellow-900/40 text-yellow-200',
  error: 'bg-red-900/40 text-red-200',
  info: 'bg-blue-900/40 text-blue-200',
  default: 'bg-gray-900/40 text-gray-200'
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className = ''
}) => {
  return (
    <span
      className={`
        inline-block font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  const variants: Record<typeof priority, BadgeVariant> = {
    high: 'error',
    medium: 'warning',
    low: 'success'
  };

  return (
    <Badge variant={variants[priority]}>
      {priority}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
  const variants: Record<typeof status, BadgeVariant> = {
    pending: 'info',
    approved: 'success',
    rejected: 'error'
  };

  return (
    <Badge variant={variants[status]}>
      {status}
    </Badge>
  );
};

export default {
  Badge,
  PriorityBadge,
  StatusBadge
}; 