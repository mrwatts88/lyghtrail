import { useUser } from "@clerk/clerk-react";
import useSWR from "swr";
import { fetcher } from "../api/fetcher";

export const ProcessList = () => {
  const { user } = useUser();

  const {
    data: task,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/tasks?${new URLSearchParams({
      userId: user.id,
    })}`,
    fetcher,
    {
      skip: !user,
    }
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleDelete = async (title) => {
    try {
      await fetch(`/tasks/${title}`, {
        method: "DELETE",
      });

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

      {task.map((tasks) => (
        <div
          key={tasks.title}
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
            {tasks.title}
          </div>
          <div
            style={{
              flex: "1",
              textAlign: "center",
            }}
          >
            {tasks.frequency}
          </div>
          <div
            style={{
              textAlign: "right",
            }}
          >
            {tasks.due_date}
          </div>
          <button
            style={{
              padding: "5px",
              margin: "0 5px",
              width: "100px",
            }}
            onClick={() => handleDelete(tasks.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
};
