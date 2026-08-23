/**
 * Theme provider exposing the Sonolo color system to the component tree.
 *
 * The MVP ships dark-mode-first, so the provider currently serves the
 * fixed Night Sky palette from colors.ts. Keeping the context in place
 * means a light theme can be added later by widening the theme shape
 * without touching call sites.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { colors, type SonoloColors } from "./colors";

interface Theme {
  colors: SonoloColors;
}

const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const theme = useMemo<Theme>(() => ({ colors }), []);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("useTheme must be used within <ThemeProvider>.");
  }
  return theme;
}
