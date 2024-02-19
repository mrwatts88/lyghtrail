import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import { useSWRConfig } from "swr";
import { useUser } from "@clerk/clerk-react";

export const DueTaskList = () => {
  const { user } = useUser();
  let d = new Date();
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const yyyymmdd = d.toISOString().slice(0, 10);

  const {
    data: tasks,
    error,
    isLoading,
  } = useSWR(
    `/due-tasks?${new URLSearchParams({
      localDate: yyyymmdd,
      userId: user.id,
    })}`,
    fetcher
  );

  const { mutate } = useSWRConfig();

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleComplete = async (id) => {
    try {
      await fetch(`/due-tasks/${id}`, {
        method: "PUT",
      });

      mutate(
        `/due-tasks?${new URLSearchParams({
          localDate: yyyymmdd,
          userId: user.id,
        })}`
      );
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
