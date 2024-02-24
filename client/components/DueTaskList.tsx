import { useUser } from "@clerk/clerk-react";
import React from "react";
import useSWR from "swr";
import { fetcher } from "~/api/fetcher";
import { Task } from "~/types/entities";

export const DueTaskList = (): React.ReactElement => {
  const { user } = useUser();

  let d = new Date();
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const yyyymmdd = d.toISOString().slice(0, 10);

  const {
    data: tasks = [],
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

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleComplete = async (id: string): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      await fetch(`/due-tasks/${id}`, { method: "PUT" });
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
          <button
            style={{
              padding: "5px",
              margin: "0 5px",
              width: "100px",
            }}
            onClick={() => handleComplete(task.id)}
          >
            Complete
          </button>
        </div>
      ))}
    </>
  );
};
