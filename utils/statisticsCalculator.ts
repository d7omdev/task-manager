import { Task } from '@/types/task';

/**
 * Statistics calculator utilities for task analytics
 */

export interface TaskStatistics {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  overdue: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

export interface WeeklyData {
  label: string;
  value: number;
  frontColor: string;
}

/**
 * Get total number of tasks
 */
export const getTotalTasks = (tasks: Task[]): number => {
  return tasks.length;
};

/**
 * Get number of completed tasks
 */
export const getCompletedTasks = (tasks: Task[]): number => {
  return tasks.filter(task => task.completed).length;
};

/**
 * Get number of active (pending) tasks
 */
export const getActiveTasks = (tasks: Task[]): number => {
  return tasks.filter(task => !task.completed).length;
};

/**
 * Calculate completion rate as percentage
 */
export const getCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completed = getCompletedTasks(tasks);
  return Math.round((completed / tasks.length) * 100);
};

/**
 * Get tasks by priority
 */
export const getTasksByPriority = (tasks: Task[], priority: 'high' | 'medium' | 'low'): number => {
  return tasks.filter(task => task.priority === priority && !task.completed).length;
};

/**
 * Get number of overdue tasks
 */
export const getOverdueTasks = (tasks: Task[]): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return tasks.filter(task => {
    if (task.completed || !task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < now;
  }).length;
};

/**
 * Get tasks completed today
 */
export const getTasksCompletedToday = (tasks: Task[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  }).length;
};

/**
 * Get tasks completed this week (last 7 days)
 */
export const getTasksCompletedThisWeek = (tasks: Task[]): number => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    return completedDate >= weekAgo && completedDate <= now;
  }).length;
};

/**
 * Get tasks completed this month
 */
export const getTasksCompletedThisMonth = (tasks: Task[]): number => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    return completedDate >= firstDayOfMonth && completedDate <= now;
  }).length;
};

/**
 * Get weekly completion data for bar chart (last 7 days)
 */
export const getWeeklyCompletionData = (tasks: Task[], primaryColor: string, secondaryColor: string): WeeklyData[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData: WeeklyData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= date && completedDate < nextDay;
    }).length;

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    weekData.push({
      label: days[date.getDay()],
      value: count,
      frontColor: isWeekend ? secondaryColor : primaryColor,
    });
  }

  return weekData;
};

/**
 * Get priority distribution data for pie chart
 */
export const getPriorityDistribution = (tasks: Task[]) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const high = activeTasks.filter(task => task.priority === 'high').length;
  const medium = activeTasks.filter(task => task.priority === 'medium').length;
  const low = activeTasks.filter(task => task.priority === 'low').length;

  return [
    { value: high, color: '#FF3B30', label: 'High' },
    { value: medium, color: '#FF9500', label: 'Medium' },
    { value: low, color: '#34C759', label: 'Low' },
  ].filter(item => item.value > 0); // Only show non-zero values
};

/**
 * Get all statistics at once
 */
export const getAllStatistics = (tasks: Task[]): TaskStatistics => {
  return {
    total: getTotalTasks(tasks),
    completed: getCompletedTasks(tasks),
    active: getActiveTasks(tasks),
    completionRate: getCompletionRate(tasks),
    highPriority: getTasksByPriority(tasks, 'high'),
    mediumPriority: getTasksByPriority(tasks, 'medium'),
    lowPriority: getTasksByPriority(tasks, 'low'),
    overdue: getOverdueTasks(tasks),
    completedToday: getTasksCompletedToday(tasks),
    completedThisWeek: getTasksCompletedThisWeek(tasks),
    completedThisMonth: getTasksCompletedThisMonth(tasks),
  };
};
