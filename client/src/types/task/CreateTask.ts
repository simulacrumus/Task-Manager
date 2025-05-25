export interface CreateTask {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: Date;
}
