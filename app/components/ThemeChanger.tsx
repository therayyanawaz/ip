import { IconButton } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

interface ThemeChangerProps {
  iconSize: number;
}

export function ThemeChanger({ iconSize }: ThemeChangerProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      size="4"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon width={iconSize} height={iconSize} />
      ) : (
        <MoonIcon width={iconSize} height={iconSize} />
      )}
    </IconButton>
  );
}
