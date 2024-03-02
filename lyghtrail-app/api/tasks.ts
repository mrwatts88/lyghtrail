import useSWR from "swr";
import { useUser } from "~/packages/clerk";
import { Task } from "~/types/entities";
import { fetchWithBaseUrl, fetcher } from "./fetcher";

export const tasksApi = {
  addTask: async ({
    title,
    frequencyNumber,
    frequencyUnit,
    dueNext,
    user,
  }: {
    title: string;
    frequencyNumber: number;
    frequencyUnit: string;
    dueNext: string;
    user: { id: string };
  }) =>
    fetchWithBaseUrl("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        frequency: `${frequencyNumber}${frequencyUnit}`,
        dueNext,
        userId: user.id,
      }),
    }),
  completeTask: async (id: string) =>
    fetchWithBaseUrl(`/due-tasks/${id}`, { method: "PUT" }),
  deleteTask: async (id: string) =>
    fetchWithBaseUrl(`/tasks/${id}`, { method: "DELETE" }),
};

export const useTasks = () => {
  const { user } = useUser();
  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Task[], Error, string | null>(
    user
      ? `/tasks?${new URLSearchParams({
          userId: user.id,
        })}`
      : null,
    fetcher
  );

  return {
    tasks,
    tasksError: error,
    tasksIsLoading: isLoading,
    tasksRefresh: mutate,
  };
};

export const useDueTasks = () => {
  const { user } = useUser();

  let d = new Date();
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const yyyymmdd = d.toISOString().slice(0, 10);

  const {
    data: dueTasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Task[], Error, string | null>(
    user
      ? `/due-tasks?${new URLSearchParams({
          localDate: yyyymmdd,
          userId: user.id,
        })}`
      : null,
    fetcher
  );

  return {
    dueTasks,
    dueTasksError: error,
    dueTasksIsLoading: isLoading,
    dueTasksRefresh: mutate,
  };
};
