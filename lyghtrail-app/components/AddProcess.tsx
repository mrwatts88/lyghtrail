import React, { FormEventHandler, useState } from "react";
import { useSWRConfig } from "swr";
import { useUser } from "@clerk/clerk-react";

function getLocalDate(): string {
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset).toISOString();
}

export const AddProcess = (): React.ReactElement => {
  const [title, setTitle] = useState<string>("");
  const [frequencyNumber, setFrequencyNumber] = useState<string>("");
  const [frequencyUnit, setFrequencyUnit] = useState<string>("D");
  const [dueNext, setDueNext] = useState<string>(getLocalDate().split("T")[0]);
  const { user } = useUser();

  const { mutate } = useSWRConfig();

  let d = new Date();
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const yyyymmdd = d.toISOString().slice(0, 10);

  const handleSubmit: FormEventHandler<
    HTMLButtonElement | HTMLFormElement
  > = async (event) => {
    event.preventDefault();

    if (!title || !frequencyNumber || !frequencyUnit || !dueNext || !user) {
      return;
    }

    try {
      await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          frequency: `${frequencyNumber}${frequencyUnit}`,
          dueNext,
          userId: user.id,
        }),
      });

      setTitle("");
      setFrequencyNumber("");
      setFrequencyUnit("D");
      setDueNext(getLocalDate().split("T")[0]);

      await mutate(
        `/tasks?${new URLSearchParams({
          userId: user.id,
        })}`
      );
      await mutate(
        user
          ? `/due-tasks?${new URLSearchParams({
              localDate: yyyymmdd,
              userId: user.id,
            })}`
          : null
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTitle(event.target.value);
  };

  const handleFrequencyNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFrequencyNumber(event.target.value);
  };

  const handleFrequencyUnitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
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
