import { useState } from "react";
import { useSWRConfig } from "swr";

function getLocalDate() {
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset).toISOString();
}

export const AddProcess = () => {
  const [title, setTitle] = useState("");
  const [frequencyNumber, setFrequencyNumber] = useState("");
  const [frequencyUnit, setFrequencyUnit] = useState("D");
  const [dueNext, setDueNext] = useState(getLocalDate().split("T")[0]);

  const { mutate } = useSWRConfig();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !frequencyNumber || !frequencyUnit || !dueNext) {
      return;
    }

    try {
      await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          frequency: `${frequencyNumber}${frequencyUnit}`,
          dueNext,
        }),
      });

      setTitle("");
      setFrequencyNumber("");
      setFrequencyUnit("");
      setDueNext("");

      mutate("http://localhost:3001/tasks");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFrequencyNumberChange = (event) => {
    setFrequencyNumber(event.target.value);
  };

  const handleFrequencyUnitChange = (event) => {
    setFrequencyUnit(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        margin: "10px auto",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: "5px",
          }}
        >
          <input
            placeholder="Title"
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            style={{
              flex: "1",
              marginRight: "5px",
            }}
          />
          <input
            type="date"
            value={dueNext}
            onChange={(e) => setDueNext(e.target.value)}
            style={{
              flex: "1",
              marginLeft: "5px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input
            type="number"
            placeholder="#"
            onChange={handleFrequencyNumberChange}
            value={frequencyNumber}
            min={1}
            style={{
              flex: "1",
              marginRight: "5px",
            }}
          />
          <select
            onChange={handleFrequencyUnitChange}
            value={frequencyUnit}
            style={{
              flex: "1",
              marginLeft: "5px",
            }}
          >
            <option value="D">Days</option>
            <option value="W">Weeks</option>
            <option value="M">Months</option>
            <option value="Y">Years</option>
          </select>
        </div>
      </div>
      <button
        onSubmit={handleSubmit}
        type="submit"
        style={{
          padding: "5px",
          width: "100px",
          margin: "0 5px",
        }}
      >
        Add
      </button>
    </form>
  );
};
