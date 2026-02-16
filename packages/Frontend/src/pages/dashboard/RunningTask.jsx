import { CircularProgress } from "@mui/material";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useProgressAnimation } from "../../hooks/ui/useProgressAnimation";

const RunningTask = () => {
  const { taskStats } = useTasks();
  const { totalTasks, remainingTasks, percentage } = taskStats;
  const animatedPercentage = useProgressAnimation(percentage);

  return (
    <div className="sm:h-[250px] relative flex max-sm:justify-between sm:flex-col sm:gap-4 bg-[#141522] text-white p-6 max-sm:px-7 rounded-xl">
      <div>
        <h2 className="text-lg mb-4">Running Task</h2>
        <div className="sm:hidden text-4xl mb-4">{remainingTasks}</div>
      </div>

      <div className="max-sm:hidden text-4xl mb-4">{remainingTasks}</div>

      <div className="flex sm:items-center justify-between md:justify-start sm:absolute bottom-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl">
                {/* Animated percentage */}
                <span className="font-light">{percentage}%</span>
              </div>
            </div>
          </div>
          <CircularProgress
            variant="determinate"
            value={100}
            size={90}
            thickness={2}
            sx={{ color: "#1F2937", position: "absolute" }}
            className="absolute bottom-0"
          />
          <CircularProgress
            variant="determinate"
            value={animatedPercentage}
            size={90}
            thickness={2}
            className="absolute bottom-0"
            sx={{
              color: "#4F46E5",
              background: "transparent",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </div>
        <div className="max-sm:flex max-sm:flex-col max-sm:justify-center text-center ml-3 md:ml-2">
          <div className="text-2xl font-normal">{totalTasks}</div>
          <div className="text-gray-400">Task</div>
        </div>
      </div>
    </div>
  );
};

export default RunningTask;
