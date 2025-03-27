import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeProvider } from "../../../provider/ThemeProvider"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        setIsLoading(true)

        try {
            // Simulación de registro - en una implementación real, esto sería una llamada a la API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulamos un registro exitoso
            localStorage.setItem("user", JSON.stringify({ name, email }))

            navigate("/dashboard")
        } catch (err) {
            setError("Error al registrar. Por favor intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemeProvider>
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
                        <CardDescription>Ingresa tus datos para registrarte en NotesApp</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Tu nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Registrando..." : "Registrarse"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <div className="mt-2 text-center text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                                Iniciar Sesión
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </ThemeProvider>
    )
}

