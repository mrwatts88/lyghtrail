import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import { useSWRConfig } from "swr";
export const ProcessList = () => {
  const {
    data: processes,
    error,
    isLoading,
  } = useSWR("http://localhost:3001/processes", fetcher);

  const { mutate } = useSWRConfig();

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleDelete = async (title) => {
    try {
      await fetch(`http://localhost:3001/processes/${title}`, {
        method: "DELETE",
      });

      mutate("http://localhost:3001/processes");
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
          <div>Frequency</div>
          <div style={{
            width: "100px"
          }} />
        </div>


      {processes.map((process) => (
        <div
          key={process.title}
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
            {process.title}
          </div>
          <div>{process.frequency}</div>
          <button
            style={{
              padding: "5px",
              margin: "0 5px",
              width: "100px",
            }}
            onClick={() => handleDelete(process.title)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
};
