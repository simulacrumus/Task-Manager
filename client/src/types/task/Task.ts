export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: Date;
  createdAt: string;
}
