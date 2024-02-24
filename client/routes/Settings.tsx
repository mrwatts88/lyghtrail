import React from "react";
import { AddProcess } from "../components/AddProcess";
import { NavBar } from "../components/NavBar";
import { ProcessList } from "../components/ProcessList";

export const Settings = (): React.ReactElement => {
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
        <ProcessList />
        <AddProcess />
      </div>
    </>
  );
};
