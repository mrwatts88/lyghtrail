import { AddProcess } from "./AddProcess";
import { ProcessList } from "./ProcessList";

export const App = () => {
  return (
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
  );
};
