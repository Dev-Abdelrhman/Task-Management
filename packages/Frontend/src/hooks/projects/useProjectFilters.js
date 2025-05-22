import { useState } from 'react';

export const useProjectFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  return {
    filters: {
      searchQuery,
      selectedCategory,
      sortOrder,
    },
    actions: {
      setSearchQuery,
      setSelectedCategory,
      toggleSortOrder,
    }
  };
}; 