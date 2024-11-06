import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'text-white')
 * cn('font-bold', { 'text-red-500': isError })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
