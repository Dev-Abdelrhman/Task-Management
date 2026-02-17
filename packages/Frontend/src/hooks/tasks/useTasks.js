import { useQuery } from "@tanstack/react-query";
import { getAllUserTasks } from "../../pages/User_Tasks/api/user_tasks";
import { useMemo } from "react";

export const useTasks = () => {
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllUserTasks,
  });

  const taskStats = useMemo(() => {
    if (!tasksData?.doc)
      return { totalTasks: 0, doneTasks: 0, remainingTasks: 0, percentage: 0 };
    const totalTasks = tasksData.results || 0;
    const doneTasks = tasksData.doc.filter(
      (task) => task.status === "Completed",
    ).length;
    const remainingTasks = totalTasks - doneTasks;
    const percentage = Math.floor(
      totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0,
    );
    return { totalTasks, doneTasks, remainingTasks, percentage };
  }, [tasksData]);

  const activityData = useMemo(() => {
    if (!tasksData?.doc) return null;
    const dayMap = ["S", "M", "T", "W", "Th", "F", "Sa"];
    const counts = { S: 0, M: 0, T: 0, W: 0, Th: 0, F: 0, Sa: 0 };
    tasksData.doc.forEach((task) => {
      if (task.status === "Completed" && task.updatedAt) {
        const date = new Date(task.updatedAt);
        const day = dayMap[date.getDay()];
        counts[day]++;
      }
    });
    return dayMap.map((day) => ({ day, tasks: counts[day] }));
  }, [tasksData]);

  return {
    tasksData,
    isLoading,
    isError,
    error,
    taskStats,
    activityData,
  };
};
