/**
 * Date and time utility functions
 */

/**
 * Format a date string or Date object to a human-readable format
 * Examples: "Today", "Tomorrow", "Jan 15", "Jan 15, 2024"
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = dateObj.toDateString() === today.toDateString();
  const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format a time string (HH:MM) or Date object to 12-hour format
 * Examples: "2:30 PM", "9:00 AM"
 */
export const formatTime = (time: string | Date): string => {
  if (typeof time === 'string') {
    // Parse HH:MM format
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a date and time together
 * Examples: "Today at 2:30 PM", "Jan 15 at 9:00 AM"
 */
export const formatDateTime = (date: string | Date, time?: string | null): string => {
  const dateStr = formatDate(date);
  if (!time) return dateStr;

  const timeStr = formatTime(time);
  return `${dateStr} at ${timeStr}`;
};

/**
 * Get relative date text with urgency indicator
 * Examples: "Overdue by 2 days", "Due today", "Due tomorrow", "Due in 3 days"
 */
export const getRelativeDateText = (
  dueDate: string | Date,
  dueTime?: string | null
): { text: string; urgency: 'overdue' | 'today' | 'soon' | 'normal' } => {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateOnly = new Date(dateObj);
  dueDateOnly.setHours(0, 0, 0, 0);

  const diffTime = dueDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`,
      urgency: 'overdue',
    };
  }

  if (diffDays === 0) {
    const timeStr = dueTime ? ` at ${formatTime(dueTime)}` : '';
    return {
      text: `Due today${timeStr}`,
      urgency: 'today',
    };
  }

  if (diffDays === 1) {
    const timeStr = dueTime ? ` at ${formatTime(dueTime)}` : '';
    return {
      text: `Due tomorrow${timeStr}`,
      urgency: 'today',
    };
  }

  if (diffDays <= 3) {
    return {
      text: `Due in ${diffDays} days`,
      urgency: 'soon',
    };
  }

  return {
    text: `Due ${formatDate(dateObj)}`,
    urgency: 'normal',
  };
};

/**
 * Convert a Date to HH:MM format string
 */
export const dateToTimeString = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Convert HH:MM string to Date object (today's date with that time)
 */
export const timeStringToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Check if a task is overdue
 */
export const isOverdue = (dueDate: string | Date, completed: boolean): boolean => {
  if (completed) return false;

  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateOnly = new Date(dateObj);
  dueDateOnly.setHours(0, 0, 0, 0);

  return dueDateOnly < today;
};
