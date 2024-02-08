import { useState } from "react";
import { AddProcess } from "./AddProcess";
import { ProcessList } from "./ProcessList";
import { DueTaskList } from "./DueTaskList";

export const App = () => {
  const [page, setPage] = useState(1);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <div>
        <button
          style={{
            padding: "10px",
            margin: "10px",
            border: "none",
            backgroundColor: page === 1 ? "#ddd" : "#fff",
            cursor: "pointer",
          }}
          onClick={() => setPage(1)}
        >
          Settings
        </button>
        <button
          style={{
            padding: "10px",
            margin: "10px",
            border: "none",
            backgroundColor: page === 2 ? "#ddd" : "#fff",
            cursor: "pointer",
          }}
          onClick={() => setPage(2)}
        >
          Due Tasks
        </button>
      </div>
      {page === 1 && (
        <div
          style={{
            width: "500px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <ProcessList />
          <AddProcess />
        </div>
      )}
      {page === 2 && (
        <div
          style={{
            width: "500px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <DueTaskList />
        </div>
      )}
    </div>
  );
};
