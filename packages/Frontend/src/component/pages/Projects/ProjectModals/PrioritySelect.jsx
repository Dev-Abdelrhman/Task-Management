import {
  Ban,
  CircleAlert,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const PrioritySelect = ({ priority, onPriorityChange }) => {
  const iconMap = {
    Urgent: (
      <CircleAlert
        size={18}
        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600"
      />
    ),
    High: (
      <SignalHigh
        size={18}
        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500"
      />
    ),
    Medium: (
      <SignalMedium
        size={18}
        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500"
      />
    ),
    Low: (
      <SignalLow
        size={18}
        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300"
      />
    ),
    Normal: (
      <Ban
        size={18}
        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300"
      />
    ),
  };

  return (
    <FormControl fullWidth>
      <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">
        Priority
      </label>
      <InputLabel id="status-label">Priority</InputLabel>
      <Select
        labelId="status-label"
        id="status-select"
        value={priority}
        label="Priority"
        className="dark:!bg-[#2D2D2D] dark:border-0 dark:border-gray-500 dark:text-gray-300"
        onChange={(e) => onPriorityChange(e.target.value)}
        MenuProps={{
          PaperProps: {
            className: "dark:bg-[#2D2D2D] dark:text-gray-300",
          },
        }}
        renderValue={(value) => (
          <span className="flex dark:text-gray-300 items-center gap-2">
            {iconMap[value]} {value}
          </span>
        )}
      >
        <MenuItem
          className="dark:text-gray-300 dark:bg-[#2D2D2D] hover:dark:bg-[#404040]"
          value="Urgent"
        >
          <CircleAlert
            size={18}
            className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600"
          />
          Urgent
        </MenuItem>
        <MenuItem
          className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
          value="High"
        >
          <SignalHigh
            size={18}
            className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500"
          />{" "}
          High
        </MenuItem>
        <MenuItem
          className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
          value="Medium"
        >
          <SignalMedium
            size={18}
            className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500"
          />{" "}
          Medium
        </MenuItem>
        <MenuItem
          className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
          value="Low"
        >
          <SignalLow
            size={18}
            className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300"
          />{" "}
          Low
        </MenuItem>
        <MenuItem
          className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
          value="Normal"
        >
          <Ban
            size={18}
            className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300"
          />{" "}
          Normal
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default PrioritySelect; 