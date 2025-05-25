import React, { useState } from "react";
import styles from "./TaskForm.module.css";
import {
  COMPLETED_LABEL,
  DESC_LABEL,
  DESC_MAX_LENGTH_VALIDATION_ERROR,
  DUE_DATE_LABEL,
  MAX_DESC_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  NEW,
  SAVE,
  SAVING_ERROR,
  TASK,
  TITLE_LABEL,
  TITLE_MAX_LENGTH_VALIDATION_ERROR,
  TITLE_MIN_LENGTH_VALIDATION_ERROR,
  UPDATE,
} from "./TaskForm.constants";
import type { CreateTask, UpdateTask, Task } from "types/task";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs, { Dayjs } from "dayjs";

type TaskFormProps = {
  task?: Task;
  onCreate: (task: CreateTask) => Promise<void>;
  onUpdate: (id: string, task: UpdateTask) => Promise<void>;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onCreate,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>("");
  const [descError, setDescError] = useState<string>("");
  const [taskFormData, setTaskFormData] = useState<CreateTask>({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate || new Date(),
    isCompleted: task?.isCompleted || false,
  });
  const [dueDate, setDueDate] = useState<Dayjs>(
    task?.dueDate ? dayjs(task.dueDate) : dayjs()
  );
  const isFormValid: boolean =
    taskFormData.title.length > MIN_TITLE_LENGTH &&
    taskFormData.title.length <= MAX_TITLE_LENGTH &&
    taskFormData.description.length <= MAX_DESC_LENGTH;

  const onChangeOfTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTaskFormData({
      ...taskFormData,
      [event.target.name]: event.target.value,
    });
    if (event.target.value.length > MAX_TITLE_LENGTH) {
      setTitleError(TITLE_MAX_LENGTH_VALIDATION_ERROR);
    } else {
      setTitleError("");
    }
  };

  const onChangeOfDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTaskFormData((prev: CreateTask) => ({
      ...prev,
      description: event.target.value,
    }));
    if (event.target.value.length > MAX_DESC_LENGTH) {
      setDescError(DESC_MAX_LENGTH_VALIDATION_ERROR);
    } else {
      setDescError("");
    }
  };

  const onChangeOfIsCompleted = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setTaskFormData((prev: CreateTask) => ({
      ...prev,
      isCompleted: event.target.checked,
    }));
  };

  const onChangeOfDueDate = (value: Date | null) => {
    if (value) {
      setDueDate(dayjs(value));
      setTaskFormData((prev: CreateTask) => ({ ...prev, dueDate: value }));
    }
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (taskFormData.title.length < 1) {
      setTitleError(TITLE_MIN_LENGTH_VALIDATION_ERROR);
    }

    if (isFormValid) {
      try {
        setIsLoading(true);

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Task form data:", taskFormData);

        if (task) {
          await onUpdate(task.id, taskFormData);
        } else {
          await onCreate(taskFormData);
        }
      } catch (error) {
        console.error(SAVING_ERROR, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <form onSubmit={onSubmitForm}>
        <Stack direction={"column"} spacing={3}>
          <Typography variant="h5">
            {`${(task && UPDATE) || NEW} ${TASK}`}
          </Typography>
          <TextField
            className={styles.title}
            error={Boolean(titleError)}
            helperText={Boolean(titleError) && titleError}
            label={TITLE_LABEL}
            margin="normal"
            name="title"
            value={taskFormData.title}
            variant="outlined"
            onChange={onChangeOfTitle}
          />

          <TextField
            className={styles.description}
            error={Boolean(descError)}
            helperText={Boolean(descError) && descError}
            label={DESC_LABEL}
            margin="normal"
            name="description"
            value={taskFormData.description}
            variant="outlined"
            onChange={onChangeOfDesc}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateField
              label={DUE_DATE_LABEL}
              value={dueDate?.toDate()}
              onChange={onChangeOfDueDate}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Checkbox
                onChange={onChangeOfIsCompleted}
                edge="start"
                checked={taskFormData.isCompleted}
                tabIndex={-1}
              />
            }
            label={COMPLETED_LABEL}
          />
          <Button
            loading={isLoading}
            loadingPosition="end"
            type="submit"
            variant="contained"
          >
            {SAVE}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
