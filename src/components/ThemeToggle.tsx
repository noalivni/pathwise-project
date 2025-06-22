
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
