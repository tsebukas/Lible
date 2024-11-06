import { ReactNode } from 'react';
import { cn } from '../../utils/styles';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
}

const Card = ({
  children,
  className,
  onClick,
  hoverable = false,
  selected = false
}: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        hoverable && 'transition-all duration-200 hover:shadow-md',
        selected && 'ring-2 ring-primary',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card subkomponendid
const Header = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'px-4 py-3 border-b border-gray-200',
      className
    )}
  >
    {children}
  </div>
);

const Title = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h3
    className={cn(
      'text-lg font-medium text-content',
      className
    )}
  >
    {children}
  </h3>
);

const Content = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'px-4 py-4',
      className
    )}
  >
    {children}
  </div>
);

const Footer = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg',
      className
    )}
  >
    {children}
  </div>
);

// Actions container komponent
const Actions = ({
  children,
  className,
  align = 'right'
}: {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) => {
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        alignmentStyles[align],
        className
      )}
    >
      {children}
    </div>
  );
};

// Badge komponent kaardi jaoks
const Badge = ({
  children,
  variant = 'default',
  className
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Lisa alamkomponendid Card objektile
Card.Header = Header;
Card.Title = Title;
Card.Content = Content;
Card.Footer = Footer;
Card.Actions = Actions;
Card.Badge = Badge;

export default Card;
