import { fetchWithBaseUrl } from "./fetcher";

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
