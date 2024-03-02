import { Button, ScrollView, StyleSheet } from "react-native";
import { tasksApi, useDueTasks, useTasks } from "~/api/tasks";
import { AddProcess } from "~/components/AddProcess";
import { Text, View } from "~/components/Themed";
import { useUser } from "~/packages/clerk";

export default function TabTwoScreen() {
  const { isLoaded, isSignedIn } = useUser();
  const { tasks, tasksError, tasksIsLoading, tasksRefresh } = useTasks();
  const { dueTasksRefresh } = useDueTasks();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (tasksError) return <Text>failed to load</Text>;
  if (tasksIsLoading) return <Text>loading...</Text>;

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await tasksApi.deleteTask(id);
      await Promise.all([tasksRefresh(), dueTasksRefresh()]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <AddProcess />
      <ScrollView style={styles.scrollView}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <View style={styles.taskTitle}>
              <Text>{task.title}</Text>
            </View>
            <View style={styles.taskFrequency}>
              <Text>{task.frequency}</Text>
            </View>
            <View style={styles.taskDueDate}>
              <Text>{task.due_date}</Text>
            </View>
            <Button onPress={() => handleDelete(task.id)} title="Delete" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
    width: "100%",
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
