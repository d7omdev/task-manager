import React, { createContext, useContext, useMemo } from 'react';
import { Task } from '@/types/task';
import {
  getAllStatistics,
  getWeeklyCompletionData,
  getPriorityDistribution,
  TaskStatistics,
  WeeklyData,
} from '@/utils/statisticsCalculator';
import { Colors } from '@/constants/theme';
import { useTheme } from './ThemeContext';

interface StatisticsContextType {
  stats: TaskStatistics;
  weeklyData: WeeklyData[];
  priorityData: Array<{ value: number; color: string; label: string }>;
  chartKey: string;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

interface StatisticsProviderProps {
  tasks: Task[];
  children: React.ReactNode;
}

export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({
  tasks,
  children,
}) => {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  
  // Create a hash of task data to detect actual changes
  // This ensures we recalculate even if the array reference doesn't change
  const tasksHash = useMemo(() => {
    if (tasks.length === 0) return 'empty';
    // Include all relevant fields that affect statistics
    return tasks.map(t => 
      `${t.id}-${t.completed}-${t.completedAt || ''}-${t.dueDate || ''}-${t.priority}-${t.createdAt}`
    ).join('|');
  }, [tasks]);
  
  // Calculate all statistics - recalculate whenever tasks array or hash changes
  const stats = useMemo(() => {
    return getAllStatistics(tasks);
  }, [tasks, tasksHash]);
  
  const weeklyData = useMemo(() => {
    return getWeeklyCompletionData(tasks, colors.primary, colors.secondary);
  }, [tasks, tasksHash, colors.primary, colors.secondary, activeTheme]);
  
  const priorityData = useMemo(() => {
    return getPriorityDistribution(tasks);
  }, [tasks, tasksHash]);
  
  // Create a key based on task data to force chart re-renders
  const chartKey = useMemo(() => {
    return `${tasks.length}-${stats.completed}-${stats.active}-${tasksHash.slice(0, 50)}`;
  }, [tasks.length, stats.completed, stats.active, tasksHash]);

  const value = useMemo(
    () => ({
      stats,
      weeklyData,
      priorityData,
      chartKey,
    }),
    [stats, weeklyData, priorityData, chartKey, tasksHash]
  );

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};

