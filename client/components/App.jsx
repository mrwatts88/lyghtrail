import { SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import { AddProcess } from "./AddProcess";
import { DueTaskList } from "./DueTaskList";
import { ProcessList } from "./ProcessList";
import { SignIn } from "./SignIn";

export const App = () => {
  const [page, setPage] = useState(2);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
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
          </div>
          <SignOutButton />
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
      </SignedIn>
    </div>
  );
};
