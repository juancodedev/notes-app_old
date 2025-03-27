import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children, defaultTheme = "system" }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useCustomTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useCustomTheme must be used within a ThemeProvider");
    return context;
};
