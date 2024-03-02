import { Button, ScrollView, StyleSheet } from "react-native";
import { tasksApi, useDueTasks, useTasks } from "~/api/tasks";
import { Text, View } from "~/components/Themed";
import { useUser } from "~/packages/clerk";

export default function TabOneScreen() {
  const { isLoaded, isSignedIn } = useUser();
  const { dueTasks, dueTasksError, dueTasksIsLoading, dueTasksRefresh } =
    useDueTasks();
  const { tasksRefresh } = useTasks();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (dueTasksError) return <Text>failed to load</Text>;
  if (dueTasksIsLoading) return <Text>loading...</Text>;

  const handleComplete = async (id: string): Promise<void> => {
    try {
      await tasksApi.completeTask(id);
      await Promise.all([tasksRefresh(), dueTasksRefresh()]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dueTasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <View style={styles.taskTitle}>
              <Text>{task.title}</Text>
            </View>
            <Button onPress={() => handleComplete(task.id)} title="Complete" />
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
