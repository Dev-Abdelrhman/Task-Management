import { Button, Menu, MenuItem } from "@mui/material";
import { Search, ChartBarStacked } from "lucide-react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

function ProjectFilters({ 
  categories, 
  AddProjectBtn,
  filters,
  actions 
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { searchQuery, selectedCategory, sortOrder } = filters;
  const { setSearchQuery, setSelectedCategory, toggleSortOrder } = actions;

  return (
    <div className="bg-white dark:bg-[#080808] flex justify-between items-center px-6 pt-2 pb-6">
      <div className="relative w-1/2">
        <span className="absolute inset-y-0 left-[2px] flex items-center pl-3">
          <Search className="h-5 w-5 text-[#8E92BC]" />
        </span>
        <input
          type="search"
          className="w-full pl-10 pr-4 py-4 dark:text-white dark:bg-[#3a3a3a] dark:border-[#3a3a3a] border border-gray-200 !rounded-[10px] focus:outline-none"
          placeholder="Search Project"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4 items-center mr-1">
        <Button
          variant="outlined"
          startIcon={<ChartBarStacked className="w-6 h-6 !text-[#8E92BC]" />}
          className="!border-gray-200 !text-gray-700 !text-sm !rounded-[10px] dark:hover:!bg-[#353535] dark:!text-[#a0a0a0] !py-3 !px-6 hover:!bg-gray-50 !capitalize"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {selectedCategory || "Category"}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ style: { maxHeight: 200, overflow: "auto" } }}
        >
          <MenuItem
            onClick={() => {
              setSelectedCategory(null);
              setAnchorEl(null);
            }}
          >
            All Categories
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setAnchorEl(null);
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Menu>

        <Button
          variant="outlined"
          startIcon={<FilterListIcon className="!w-6 !h-6 !text-[#8E92BC]" />}
          className="!border-gray-200 !text-gray-700 !rounded-[10px] dark:!text-[#a0a0a0] dark:hover:!bg-[#353535] !py-3 !px-6 hover:!bg-gray-50 !capitalize"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc"
            ? "Deadline (Asc)"
            : sortOrder === "desc"
            ? "Deadline (Desc)"
            : "Sort By : Deadline"}
        </Button>
        {AddProjectBtn && <div className="ml-2">{AddProjectBtn}</div>}
      </div>
    </div>
  );
}

export default ProjectFilters;
