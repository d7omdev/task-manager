import { create } from "zustand";
import { Task } from "@/types/task";

interface TasksStore {
  tasks: Task[];
  isLoaded: boolean;
  setTasks: (tasks: Task[]) => void;
  updateTasks: (updater: (tasks: Task[]) => Task[]) => void;
  setIsLoaded: (value: boolean) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  isLoaded: false,
  setTasks: (tasks) => set({ tasks }),
  updateTasks: (updater) =>
    set((state) => ({
      tasks: updater(state.tasks),
    })),
  setIsLoaded: (value) => set({ isLoaded: value }),
}));

