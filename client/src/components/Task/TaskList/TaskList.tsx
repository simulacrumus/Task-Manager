import React from "react";
import styles from "./TaskList.module.css";
import { Divider, List, Box } from "@mui/material";
import type { CreateTask, UpdateTask, Task } from "types/task";
import { TaskItem } from "@components/Task/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onCreate: (task: CreateTask) => Promise<void>;
  onUpdate: (id: string, task: UpdateTask) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onOpen: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdate,
  onDelete,
  onOpen,
}) => {
  return (
    <List className={styles.list}>
      {tasks.map((task) => {
        return (
          <Box key={task.id}>
            <TaskItem
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onClick={() => onOpen(task.id)}
            />
            <Divider />
          </Box>
        );
      })}
    </List>
  );
};
