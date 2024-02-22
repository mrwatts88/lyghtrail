import React from "react";
import { useUser } from "@clerk/clerk-react";
import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import { Task } from "../types/entities";

export const ProcessList = (): React.ReactElement => {
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

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleDelete = async (title: string): Promise<void> => {
    try {
      await fetch(`/tasks/${title}`, { method: "DELETE" });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "100px",
          }}
        >
          Title
        </div>
        <div
          style={{
            flex: "1",
            textAlign: "center",
          }}
        >
          Frequency
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          Due Date
        </div>
        <div
          style={{
            padding: "5px",
            margin: "0 5px",
            width: "100px",
          }}
        />
      </div>

      {tasks.map((task) => (
        <div
          key={task.title}
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px auto",
          }}
        >
          <div
            style={{
              width: "100px",
            }}
          >
            {task.title}
          </div>
          <div
            style={{
              flex: "1",
              textAlign: "center",
            }}
          >
            {task.frequency}
          </div>
          <div
            style={{
              textAlign: "right",
            }}
          >
            {task.due_date}
          </div>
          <button
            style={{
              padding: "5px",
              margin: "0 5px",
              width: "100px",
            }}
            onClick={() => handleDelete(task.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
};
