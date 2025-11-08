import { useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/types/task";
import { useTasksStore } from "@/stores/tasksStore";

const STORAGE_KEY = "@tasks";

/**
 * Migration helper to ensure all tasks have required new fields
 */
const migrateTask = (task: any): Task => {
  const now = new Date().toISOString();
  return {
    ...task,
    createdAt: task.createdAt || now,
    completedAt: task.completedAt || null,
    dueDate: task.dueDate || null,
    dueTime: task.dueTime || null,
    priority: task.priority || "medium",
    lastModified: task.lastModified || now,
    attachments: task.attachments || [],
  };
};

/**
 * Convert Firestore document to Task
 */
const firestoreToTask = (doc: any): Task => {
  const data = doc.data();

  // Helper to convert Firestore Timestamp to ISO string
  const toISOString = (field: any): string | null => {
    if (!field) return null;
    if (field.toDate) return field.toDate().toISOString();
    if (typeof field === "string") return field;
    return null;
  };

  // Ensure attachments are properly formatted
  const attachments = (data.attachments || []).map((att: any) => ({
    id: att.id || Date.now().toString(),
    uri: att.uri || "",
    name: att.name || "Untitled",
    type: att.type || "file",
    size: att.size || undefined,
  }));

  return {
    id: doc.id,
    text: data.text || "",
    completed: data.completed || false,
    createdAt: toISOString(data.createdAt) || new Date().toISOString(),
    completedAt: toISOString(data.completedAt),
    dueDate: toISOString(data.dueDate),
    dueTime: data.dueTime || null,
    priority: data.priority || "medium",
    lastModified: toISOString(data.lastModified) || new Date().toISOString(),
    attachments: attachments,
  };
};

export const useTasks = () => {
  const tasks = useTasksStore((state) => state.tasks);
  const isLoaded = useTasksStore((state) => state.isLoaded);
  const setTasks = useTasksStore((state) => state.setTasks);
  const updateTasks = useTasksStore((state) => state.updateTasks);
  const setIsLoaded = useTasksStore((state) => state.setIsLoaded);
  const { user } = useAuth();
  const db = getDb();

  // Determine if we should use Firebase or AsyncStorage
  const useFirebase = db !== null && user !== null;

  // Load from AsyncStorage on mount (for initial load or fallback)
  useEffect(() => {
    if (useFirebase) {
      // Firebase will handle loading via onSnapshot
      setIsLoaded(true);
      return;
    }

    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          const migratedTasks = parsedTasks.map(migrateTask);
          setTasks(migratedTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTasks();
  }, [useFirebase, setIsLoaded, setTasks]);

  // Set up Firestore real-time listener
  useEffect(() => {
    if (!useFirebase) {
      return;
    }

    const tasksCollection = collection(db, "users", user!.uid, "tasks");
    const q = query(tasksCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const firestoreTasks = querySnapshot.docs.map(firestoreToTask);
        setTasks(firestoreTasks);
        setIsLoaded(true);

        // Also save to AsyncStorage as backup
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreTasks)).catch(
          console.error,
        );
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        // Fallback to AsyncStorage on error
        AsyncStorage.getItem(STORAGE_KEY)
          .then((storedTasks) => {
            if (storedTasks) {
              const parsedTasks = JSON.parse(storedTasks);
              const migratedTasks = parsedTasks.map(migrateTask);
              setTasks(migratedTasks);
            }
            setIsLoaded(true);
          })
          .catch(console.error);
      },
    );

    return () => unsubscribe();
  }, [db, user, useFirebase, setTasks, setIsLoaded]);

  // Save to AsyncStorage whenever tasks change (for offline fallback)
  useEffect(() => {
    if (!isLoaded || useFirebase) return; // Don't save if using Firebase (it's handled by listener)

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    };

    saveTasks();
  }, [tasks, isLoaded, useFirebase]);

  const addTask = useCallback(
    async (
      text: string,
      options?: {
        dueDate?: string | null;
        dueTime?: string | null;
        priority?: "low" | "medium" | "high";
        attachments?: Task["attachments"];
      },
    ) => {
      if (!text.trim()) return;

      const now = new Date().toISOString();

      // Serialize attachments to ensure they're Firestore-compatible
      const serializedAttachments = (options?.attachments || []).map((att) => ({
        id: att.id,
        uri: att.uri,
        name: att.name || "Untitled",
        type: att.type,
        size: att.size || null,
      }));

      const newTask = {
        text: text.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        completedAt: null,
        dueDate: options?.dueDate
          ? Timestamp.fromDate(new Date(options.dueDate))
          : null,
        dueTime: options?.dueTime || null,
        priority: options?.priority || "medium",
        lastModified: serverTimestamp(),
        attachments: serializedAttachments,
      };

      if (useFirebase) {
        try {
          const tasksCollection = collection(db!, "users", user!.uid, "tasks");
          await addDoc(tasksCollection, newTask);
          // onSnapshot will update local state automatically
        } catch (error) {
          console.error("Failed to add task to Firestore:", error);
          // Fallback to local state
          const localTask: Task = {
            id: Date.now().toString(),
            text: newTask.text,
            completed: newTask.completed,
            createdAt: now,
            completedAt: null,
            dueDate: options?.dueDate ? options.dueDate : null,
            dueTime: options?.dueTime || null,
            priority: options?.priority || "medium",
            lastModified: now,
            attachments: options?.attachments || [],
          };
          updateTasks((prevTasks) => [...prevTasks, localTask]);
        }
      } else {
        const localTask: Task = {
          id: Date.now().toString(),
          text: newTask.text,
          completed: newTask.completed,
          createdAt: now,
          completedAt: null,
          dueDate: options?.dueDate ? options.dueDate : null,
          dueTime: options?.dueTime || null,
          priority: options?.priority || "medium",
          lastModified: now,
          attachments: options?.attachments || [],
        };
        updateTasks((prevTasks) => [...prevTasks, localTask]);
      }
    },
    [useFirebase, db, user, updateTasks],
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      const currentTasks = useTasksStore.getState().tasks;
      const task = currentTasks.find((t) => t.id === taskId);
      if (!task) return;

      const now = new Date().toISOString();
      const updatedTask: any = {
        completed: !task.completed,
        lastModified: serverTimestamp(),
      };

      if (!task.completed) {
        updatedTask.completedAt = serverTimestamp();
      } else {
        updatedTask.completedAt = null;
      }

      if (useFirebase) {
        try {
          const taskRef = doc(db!, "users", user!.uid, "tasks", taskId);
          await updateDoc(taskRef, updatedTask);
          // onSnapshot will update local state automatically
        } catch (error) {
          console.error("Failed to update task in Firestore:", error);
          // Fallback to local state
          updateTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    completed: !t.completed,
                    completedAt: !t.completed ? now : null,
                    lastModified: now,
                  }
                : t,
            ),
          );
        }
      } else {
        updateTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? now : null,
                  lastModified: now,
                }
              : t,
          ),
        );
      }
    },
    [useFirebase, db, user, updateTasks],
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: {
        text?: string;
        priority?: "low" | "medium" | "high";
        dueDate?: string | null;
        dueTime?: string | null;
        attachments?: Task["attachments"];
      },
    ) => {
      const now = new Date().toISOString();
      const updatedTask: any = {
        lastModified: serverTimestamp(),
      };

      if (updates.text !== undefined) {
        updatedTask.text = updates.text.trim();
      }
      if (updates.priority !== undefined) {
        updatedTask.priority = updates.priority;
      }
      if (updates.dueDate !== undefined) {
        updatedTask.dueDate = updates.dueDate
          ? Timestamp.fromDate(new Date(updates.dueDate))
          : null;
      }
      if (updates.dueTime !== undefined) {
        updatedTask.dueTime = updates.dueTime || null;
      }
      if (updates.attachments !== undefined) {
        // Serialize attachments to ensure they're Firestore-compatible
        updatedTask.attachments = updates.attachments.map((att) => ({
          id: att.id,
          uri: att.uri,
          name: att.name || "Untitled",
          type: att.type,
          size: att.size || null,
        }));
      }

      if (useFirebase) {
        try {
          const taskRef = doc(db!, "users", user!.uid, "tasks", taskId);
          await updateDoc(taskRef, updatedTask);
          // onSnapshot will update local state automatically
        } catch (error) {
          console.error("Failed to update task in Firestore:", error);
          // Fallback to local state
          const task = useTasksStore
            .getState()
            .tasks.find((t) => t.id === taskId);
          if (task) {
            updateTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      ...updates,
                      lastModified: now,
                    }
                  : t,
              ),
            );
          }
        }
      } else {
        updateTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ...updates,
                  lastModified: now,
                }
              : t,
          ),
        );
      }
    },
    [useFirebase, db, user, updateTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (useFirebase) {
        try {
          const taskRef = doc(db!, "users", user!.uid, "tasks", taskId);
          await deleteDoc(taskRef);
          // onSnapshot will update local state automatically
        } catch (error) {
          console.error("Failed to delete task from Firestore:", error);
          // Fallback to local state
          updateTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
        }
      } else {
        updateTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
      }
    },
    [useFirebase, db, user, updateTasks],
  );

  const clearCompleted = useCallback(async () => {
    if (useFirebase) {
      try {
        const completedTasks = useTasksStore
          .getState()
          .tasks.filter((t) => t.completed);
        const deletePromises = completedTasks.map((task) => {
          const taskRef = doc(db!, "users", user!.uid, "tasks", task.id);
          return deleteDoc(taskRef);
        });
        await Promise.all(deletePromises);
        // onSnapshot will update local state automatically
      } catch (error) {
        console.error("Failed to clear completed tasks in Firestore:", error);
        // Fallback to local state
        updateTasks((prevTasks) => prevTasks.filter((t) => !t.completed));
      }
    } else {
      updateTasks((prevTasks) => prevTasks.filter((t) => !t.completed));
    }
  }, [useFirebase, db, user, updateTasks]);

  return {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    isLoading: !isLoaded,
  };
};
