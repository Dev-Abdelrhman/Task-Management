export const useTheme = () => {
  const isDarkMode = typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;

  return {
    isDarkMode,
    colors: {
      axis: isDarkMode ? "#ffffff" : "#9CA3AF",
      chartBg: isDarkMode ? "#222222" : "#fff",
      line: isDarkMode ? "#a5b4fc" : "#111827",
      dotFill: isDarkMode ? "#1c2841" : "#fff"
    }
  };
}; 