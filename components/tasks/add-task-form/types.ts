import { TaskAttachment } from "@/types/task";

export interface AddTaskOptions {
    dueDate?: string | null;
    dueTime?: string | null;
    priority?: "low" | "medium" | "high";
    attachments?: TaskAttachment[];
}

export type AddTaskHandler = (text: string, options?: AddTaskOptions) => void;

