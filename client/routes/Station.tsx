import React from "react";
import { DueTaskList } from "../components/DueTaskList";
import { NavBar } from "../components/NavBar";

export const Station = (): React.ReactElement => {
  return (
    <>
      <NavBar />
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
    </>
  );
};
