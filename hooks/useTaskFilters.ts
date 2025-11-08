import { useMemo } from 'react';
import { Task } from '@/types/task';
import { isOverdue } from '@/utils/dateTime';

export type TaskFilter = 'all' | 'active' | 'completed' | 'overdue' | 'today';
export type TaskSort = 'newest' | 'oldest' | 'alphabetical' | 'dueDate' | 'priority';

interface FilterCounts {
  all: number;
  active: number;
  completed: number;
  overdue: number;
  today: number;
}

/**
 * Hook to handle task sorting and filtering logic
 */
export const useTaskFilters = (tasks: Task[], filter: TaskFilter, sort: TaskSort) => {
  // Sort tasks based on preference
  const sortedTasks = useMemo(() => {
    const tasksCopy = [...tasks];

    switch (sort) {
      case 'newest':
        return tasksCopy.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return tasksCopy.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'alphabetical':
        return tasksCopy.sort((a, b) =>
          a.text.toLowerCase().localeCompare(b.text.toLowerCase())
        );
      case 'dueDate':
        return tasksCopy.sort((a, b) => {
          // Tasks with no due date go to the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return tasksCopy.sort((a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
        );
      default:
        return tasksCopy;
    }
  }, [tasks, sort]);

  // Calculate filtered tasks (applied after sorting)
  const filteredTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case 'active':
        return sortedTasks.filter((task) => !task.completed);
      case 'completed':
        return sortedTasks.filter((task) => task.completed);
      case 'overdue':
        return sortedTasks.filter((task) => {
          if (task.completed || !task.dueDate) return false;
          return isOverdue(task.dueDate, task.completed);
        });
      case 'today':
        return sortedTasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === now.getTime() || dueDate.getTime() === tomorrow.getTime();
        });
      default:
        return sortedTasks;
    }
  }, [sortedTasks, filter]);

  // Calculate counts for filter badges
  const filterCounts = useMemo((): FilterCounts => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
      overdue: tasks.filter((task) => {
        if (task.completed || !task.dueDate) return false;
        return isOverdue(task.dueDate, task.completed);
      }).length,
      today: tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === now.getTime() || dueDate.getTime() === tomorrow.getTime();
      }).length,
    };
  }, [tasks]);

  return {
    filteredTasks,
    filterCounts,
  };
};

