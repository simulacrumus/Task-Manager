import React from "react";
import styles from "./TaskItem.module.css";
import { DELETE_ERROR, UPDATE_ERROR } from "./TaskItem.constants";
import type { UpdateTask, Task } from "types/task";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, task: UpdateTask) => Promise<void>;
  onClick: () => void;
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onUpdate,
  onClick,
}) => {
  const onChangeOfIsCompleted = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    try {
      const updateTask: UpdateTask = {
        ...task,
        isCompleted: event.target.checked,
      };
      await onUpdate(task.id, updateTask);
    } catch (error) {
      console.error(UPDATE_ERROR, error);
    }
  };

  const onDeleteTask = async () => {
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error(DELETE_ERROR, error);
    }
  };

  return (
    <ListItem
      key={task.id}
      secondaryAction={
        <Stack direction={"row"} spacing={1} className={styles.buttonGroup}>
          <Checkbox
            onChange={onChangeOfIsCompleted}
            edge="start"
            checked={task.isCompleted}
            tabIndex={-1}
          />
          <IconButton edge="end" aria-label={"delete"} onClick={onDeleteTask}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      }
      disablePadding
    >
      <ListItemButton role={undefined} onClick={onClick}>
        <Stack direction={"column"}>
          <ListItemText
            id={`${task.id}`}
            primary={task.title}
            secondary={task.description}
            sx={{
              textDecoration: task.isCompleted ? "line-through" : "",
            }}
          />
          {task.dueDate && (
            <ListItemText
              sx={{ textDecoration: task.isCompleted ? "line-through" : "" }}
              secondary={"Due: ".concat(format(task.dueDate, "MMMM d, yyyy"))}
            />
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};
