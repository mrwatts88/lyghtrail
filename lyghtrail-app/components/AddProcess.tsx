import { useUser } from "~/packages/clerk";
import React, { useState } from "react";
import { Button, TextInput } from "react-native";
import { useSWRConfig } from "swr";
import { tasksApi } from "~/api/tasks";
import { View } from "./Themed";

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

  const handleSubmit = async () => {
    if (!title || !frequencyNumber || !frequencyUnit || !dueNext || !user) {
      return;
    }

    try {
      await tasksApi.addTask({
        title,
        frequencyNumber: parseInt(frequencyNumber, 10),
        frequencyUnit,
        dueNext,
        user,
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

  const handleTitleChange = (inputValue: string): void => {
    if (inputValue.length > 255) {
      setTitle(inputValue.slice(0, 255));
    } else {
      setTitle(inputValue);
    }
  };

  const handleFrequencyNumberChange = (freq: string): void => {
    setFrequencyNumber(freq);
  };

  const handleFrequencyUnitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFrequencyUnit(event.target.value);
  };

  return (
    // <form
    //   onSubmit={handleSubmit}
    //   style={{
    //     margin: "10px auto",
    //     display: "flex",
    //     justifyContent: "space-between",
    //   }}
    // >
    <View>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={handleTitleChange}
            style={{
              flex: 1,
              marginRight: 5,
            }}
          />
          <TextInput
            value={dueNext}
            onChangeText={setDueNext}
            style={{
              flex: 1,
              marginLeft: 5,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="#"
            onChangeText={handleFrequencyNumberChange}
            value={frequencyNumber}
            style={{
              flex: 1,
              marginRight: 5,
            }}
          />
          {/* <select
            onChange={handleFrequencyUnitChange}
            value={frequencyUnit}
            style={{
              flex: "1",
              marginLeft: "5px",
            }}
          >
            <option value="D">
              <Text>Days</Text>
            </option>
            <option value="W">
              <Text>Weeks</Text>
            </option>
            <option value="M">
              <Text>Months</Text>
            </option>
            <option value="Y">
              <Text>Years</Text>
            </option>
          </select> */}
        </View>
      </View>
      <Button
        title="Add"
        onPress={handleSubmit}
        // style={{
        //   padding:5,
        //   width: 100,
        //   marginHorizontal: 5,
        //   marginVertical: 0,
        // }}
      />
    </View>
    // {/* </form> */}
  );
};
