import React from "react";
import { CircularProgress } from "@mui/material";
import { useTasks } from "../../../hooks/useTasks";
import { useProgressAnimation } from "../../../hooks/useProgressAnimation";

const RunningTask = () => {
  const { taskStats } = useTasks();
  const { totalTasks, remainingTasks, percentage } = taskStats;
  const animatedPercentage = useProgressAnimation(percentage);
  
    return (
      <div className="h-[250px] relative flex flex-col gap-4 bg-[#111827] text-white p-6 rounded-xl">
        <div>
          <h2 className="text-lg">Running Task</h2>
        </div>
        {/* Instantly show the number */}
        <div className="text-4xl font-simi mb-4">{remainingTasks}</div>
        <div className="flex items-center justify-between md:justify-start absolute bottom-6">
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
          <div className="text-center md:ml-2">
            <div className="text-2xl font-normal">{totalTasks}</div>
            <div className="text-gray-400">Task</div>
          </div>
        </div>
      </div>
    );
  };

export default RunningTask;
