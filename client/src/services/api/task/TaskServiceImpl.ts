import type { TaskService } from "./TaskService";
import type { CreateTask, UpdateTask, Task } from "types/task";
import type { ApiClient } from "../ApiClient";

export class TaskServiceImpl implements TaskService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async getTasks(params: Record<string, string>): Promise<Task[]> {
    return this.client.get<Task[]>("/tasks", params);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.client.get<Task>(`/tasks/${id}`);
  }

  async createTask(task: CreateTask): Promise<Task> {
    return this.client.post<Task>("/tasks", task);
  }

  async updateTask(id: string, task: UpdateTask): Promise<Task> {
    console.log(task);
    return this.client.put<Task>(`/tasks/${id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    return this.client.delete<void>(`/tasks/${id}`);
  }
}
