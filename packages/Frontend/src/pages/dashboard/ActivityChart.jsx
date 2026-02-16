import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material";
import { useTasks } from "../../hooks/tasks/useTasks";
import { CHART_COLORS, CHART_CONFIG } from "../../constants/chart";

const ActivityChart = () => {
  const { activityData } = useTasks();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? CHART_COLORS.dark : CHART_COLORS.light;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
          {`${payload[0].value} Task${payload[0].value !== 1 ? "s" : ""}`}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[250px] bg-white dark:border-[#222222] dark:bg-[#222222] p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium dark:text-white">Activity</h2>
        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1 rounded-xl select-none">
          <span>This Week</span>
        </div>
      </div>
      <div className="relative h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={activityData}
            margin={CHART_CONFIG.margin}
            style={{
              background: colors.chartBg,
              borderRadius: "12px",
            }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: colors.axis }}
              dy={10}
            />
            <YAxis
              domain={[1, 3]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: colors.axis }}
              dx={-10}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke={colors.line}
              strokeWidth={3}
              dot={{
                ...CHART_CONFIG.dot,
                fill: colors.dotFill,
              }}
              activeDot={{
                ...CHART_CONFIG.activeDot,
                stroke: colors.dotFill,
              }}
              style={{ filter: "drop-shadow(0 2px 8px #11182733)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
