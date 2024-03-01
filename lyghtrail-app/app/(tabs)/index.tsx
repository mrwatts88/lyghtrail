import { useUser } from "~/packages/clerk";
import { Button, StyleSheet } from "react-native";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "~/api/fetcher";
import { tasksApi } from "~/api/tasks";
import { Text, View } from "~/components/Themed";
import { Task } from "~/types/entities";

export default function TabOneScreen() {
  const { user } = useUser();
  const { mutate: mutateTasks } = useSWRConfig();

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
      ? `/due-tasks?${new URLSearchParams({
          localDate: yyyymmdd,
          userId: user.id,
        })}`
      : null,
    fetcher
  );

  if (error) return <Text>failed to load</Text>;
  if (isLoading) return <Text>loading...</Text>;

  const handleComplete = async (id: string): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      await tasksApi.completeTask(id);
      await mutate();
      await mutateTasks(
        user
          ? `/tasks?${new URLSearchParams({
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
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskRow}>
          <View style={styles.taskTitle}><Text>{task.title}</Text></View>
          <Button onPress={() => handleComplete(task.id)} title="Complete" />
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
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: "auto",
  },
  taskTitle: {
    width: 100,
  },
  taskButton: {
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 0,
    width: 100,
  },
});
