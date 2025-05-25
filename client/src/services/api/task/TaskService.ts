import type { CreateTask, Task, UpdateTask } from "types/task";

export interface TaskService {
  getTasks(params: Record<string, string>): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(task: CreateTask): Promise<Task>;
  updateTask(id: string, task: UpdateTask): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
