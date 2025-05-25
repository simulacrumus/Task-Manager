import React, { useCallback, useEffect, useState } from "react";
import styles from "./TaskContainer.module.css";
import {
  DELETE_ERROR,
  ERROR_MESSAGE_DISAPPER_TIMEOUT,
  LOADING_ERROR,
  LOADING_TASKS,
  NEW,
  NO_TASKS_FOUND_MESSAGE,
  SAVING_ERROR,
  SHOW_OMPLETED_ONLY,
  UPDATE_ERROR,
} from "./TaskContainer.constants";
import { Alert, Button, Container, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskList } from "@components/Task/TaskList";
import { taskService } from "@services/api/task";
import type { CreateTask, UpdateTask, Task } from "types/task";
import { TaskForm } from "@components/Task/TaskForm";
import { Modal } from "@components/Common/Modal";
import { LoadingBar } from "@components/Common/LoadingBar";
import { SearchBar } from "@components/Common/SearchBar";
import { LabeledCheckbox } from "@components/Common/LabeledCheckbox/LabeledCheckbox";
import { useModal } from "@hooks/useModal";

export const TaskContainer: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task | undefined>(undefined);

  const [params, setParams] = useState<Record<string, string>>({
    query: "",
    completed: "",
  });
  const [showCompletedOnly, setShowCompletedOnly] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, ERROR_MESSAGE_DISAPPER_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const {
    isOpen: isTaskFormModalOpen,
    openModal: openTaskFormModal,
    closeModal: closeTaskFormModal,
  } = useModal();

  const onSearchChange = useCallback(async (value: string) => {
    try {
      setParams((prev) => ({ ...prev, query: value }));
      const response = await taskService.getTasks({ ...params, query: value });
      setTasks(response);
    } catch (error) {
      setError(LOADING_ERROR);
      console.error(LOADING_ERROR, error);
    } finally {
    }
    setParams((prev) => ({ ...prev, query: value }));
    console.log(value);
  }, []);

  const onChangeOfShowCompletedOnly = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    try {
      setIsDataLoading(true);
      setShowCompletedOnly(event.target.checked);
      var showCompletedOnlyValue: string = event.target.checked ? "true" : "";
      setParams((prev) => ({ ...prev, completed: showCompletedOnlyValue }));

      const response = await taskService.getTasks({
        ...params,
        completed: showCompletedOnlyValue,
      });
      setTasks(response);
    } catch (error) {
      console.error(LOADING_ERROR, error);
      setError(LOADING_ERROR);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setIsDataLoading(true);
      const response = await taskService.getTasks(params);
      setTasks(response);
    } catch (error) {
      setError(LOADING_ERROR);
      console.error(LOADING_ERROR, error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const onCreateTask = async (task: CreateTask) => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error(SAVING_ERROR, task);
      setError(SAVING_ERROR);
    } finally {
      closeTaskFormModal();
    }
  };

  const onUpdateTask = async (id: string, task: UpdateTask) => {
    try {
      const updatedTask = await taskService.updateTask(id, task);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error(UPDATE_ERROR, task);
      setError(UPDATE_ERROR);
    } finally {
      closeTaskFormModal();
    }
  };

  const onDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(DELETE_ERROR, error);
      await fetchTasks();
      setError(DELETE_ERROR);
    }
  };

  const onOpenTaskFormModal = (id?: string) => {
    const foundTask = tasks.find((task) => task.id === id);
    setTask(foundTask);
    openTaskFormModal();
  };

  return (
    <Container>
      <Modal open={isTaskFormModalOpen} onClose={closeTaskFormModal}>
        <TaskForm task={task} onCreate={onCreateTask} onUpdate={onUpdateTask} />
      </Modal>

      {error && (
        <Alert className={styles.alert} severity="error">
          {error}
        </Alert>
      )}

      <Stack direction={"row"} spacing={3}>
        <SearchBar onDebouncedChange={onSearchChange} />
        <LabeledCheckbox
          label={SHOW_OMPLETED_ONLY}
          checked={showCompletedOnly}
          onChange={onChangeOfShowCompletedOnly}
        />
        <Button
          variant="outlined"
          endIcon={<AddIcon />}
          onClick={() => {
            onOpenTaskFormModal();
          }}
        >
          {NEW}
        </Button>
      </Stack>

      {isDataLoading && <LoadingBar text={LOADING_TASKS} />}

      {tasks.length === 0 && (
        <Alert className={styles.alert} severity="info">
          {NO_TASKS_FOUND_MESSAGE}
        </Alert>
      )}

      <TaskList
        tasks={tasks}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        onCreate={onCreateTask}
        onOpen={onOpenTaskFormModal}
      />
    </Container>
  );
};
