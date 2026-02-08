import { IconMoon, IconSun } from '@tabler/icons-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 
                 hover:bg-primary-200 dark:hover:bg-primary-700 transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-secondary-500/50"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <IconSun className="w-5 h-5" stroke={2} />
      ) : (
        <IconMoon className="w-5 h-5" stroke={2} />
      )}
    </button>
  );
}
