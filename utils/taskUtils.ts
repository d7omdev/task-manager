import { Colors } from '@/constants/theme';

/**
 * Get priority color for a task
 */
export const getPriorityColor = (
  priority: 'low' | 'medium' | 'high',
  colors: typeof Colors.light
): string => {
  switch (priority) {
    case 'high':
      return colors.danger;
    case 'medium':
      return colors.warning;
    case 'low':
      return colors.success;
    default:
      return colors.textSecondary;
  }
};

/**
 * Get urgency color for due date
 */
export const getUrgencyColor = (
  urgency: 'overdue' | 'today' | 'soon' | 'normal',
  colors: typeof Colors.light
): string => {
  switch (urgency) {
    case 'overdue':
      return colors.danger;
    case 'today':
      return colors.warning;
    case 'soon':
      return '#FFD700'; // Yellow
    case 'normal':
      return colors.textSecondary;
  }
};


