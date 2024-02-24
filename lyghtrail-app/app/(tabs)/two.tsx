import { useUser } from "@clerk/clerk-react";
import { Button, StyleSheet } from "react-native";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "~/api/fetcher";
import { AddProcess } from "~/components/AddProcess";
import { MonoText } from "~/components/StyledText";
import { View } from "~/components/Themed";
import { Task } from "~/types/entities";

export default function TabTwoScreen() {
  const { user } = useUser();
  const { mutate: mutateDueTasks } = useSWRConfig();

  let d = new Date();
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const yyyymmdd = d.toISOString().slice(0, 10);

  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Task[], Error, string | null>(
    user
      ? `/tasks?${new URLSearchParams({
          userId: user.id,
        })}`
      : null,
    fetcher
  );

  if (error) return <MonoText>failed to load</MonoText>;
  if (isLoading) return <MonoText>loading...</MonoText>;

  const handleDelete = async (title: string): Promise<void> => {
    try {
      await fetch(`/tasks/${title}`, { method: "DELETE" });
      await mutate();
      await mutateDueTasks(
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

  return (
    <View style={styles.container}>
      <AddProcess />
      {tasks.map((task) => (
        <View key={task.title} style={styles.taskRow}>
          <View style={styles.taskTitle}>{task.title}</View>
          <View style={styles.taskFrequency}>{task.frequency}</View>
          <View style={styles.taskDueDate}>{task.due_date}</View>
          <Button
            onPress={() => handleDelete(task.id)}
            title="Delete"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: "auto",
  },
  taskTitle: {
    width: 100,
  },
  taskFrequency: {
    width: 100,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  taskDueDate: {
    marginHorizontal: 20,
  },
  taskButton: {
    padding: 5,
    marginHorizontal: 20,
    marginVertical: 0,
    width: 100,
  },
});