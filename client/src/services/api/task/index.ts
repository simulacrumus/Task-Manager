import { apiClient } from "..";
import type { TaskService } from "./TaskService";
import { TaskServiceImpl } from "./TaskServiceImpl";

export const taskService:TaskService = new TaskServiceImpl(apiClient);