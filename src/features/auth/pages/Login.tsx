import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Simulación de login - en una implementación real, esto sería una llamada a la API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulamos un login exitoso
            localStorage.setItem("user", JSON.stringify({ email }))

            navigate("/dashboard")
        } catch (err) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold'>
                        Iniciar Sesión
                    </CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder a tus notas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="mt-2 text-center text-sm">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                            Regístrate
                        </Link>
                    </div>
                </CardFooter>

            </Card>

        </div >
    )
}

export default LoginPage