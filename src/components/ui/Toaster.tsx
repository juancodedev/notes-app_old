import { Toaster as Sonner, toast} from "sonner";
import { useCustomTheme } from "../../provider/ThemeProvider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useCustomTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    );
};

export const showToast = () => {
    toast("Mensaje de prueba", {
        description: "Esto es un mensaje con acción.",
        action: {
            label: "Deshacer",
            onClick: () => console.log("Acción ejecutada"), // Aquí defines lo que hará el botón
        },
    });
};

export { Toaster };

