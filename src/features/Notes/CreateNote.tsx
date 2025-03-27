"use client"

import { useState, useEffect, useRef } from "react"
// import { useRouter, useParams } from "next/navigation"
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowLeft, Save, AlertTriangle, GitMerge, RefreshCw, X } from "lucide-react"
import { Providers } from "../../provider/Providers"

import { TagInput, type Tag } from "@/components/tag-input"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
  isBeingEdited?: boolean
  editedBy?: string
}

// Lista de etiquetas predefinidas
const predefinedTags: Tag[] = [
  { id: "tag-1", name: "Trabajo", color: "bg-blue-500" },
  { id: "tag-2", name: "Personal", color: "bg-green-500" },
  { id: "tag-3", name: "Importante", color: "bg-red-500" },
  { id: "tag-4", name: "Ideas", color: "bg-purple-500" },
  { id: "tag-5", name: "Proyecto", color: "bg-yellow-500" },
  { id: "tag-6", name: "Recordatorio", color: "bg-pink-500" },
  { id: "tag-7", name: "Reunión", color: "bg-indigo-500" },
  { id: "tag-8", name: "Tarea", color: "bg-orange-500" },
]

export default function CreateNote() {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>(predefinedTags)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictData, setConflictData] = useState<{ title: string; content: string; tags: Tag[] } | null>(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [showAsModal, setShowAsModal] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const navigate = useNavigate();
  const params = useParams()
  const id = params.id as string

  const isNewNote = id === "new"

  // Cargar nota
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/login")
      return
    }

    // Cargar todas las etiquetas (simulado)
    const storedTags = localStorage.getItem("allTags")
    if (storedTags) {
      setAllTags(JSON.parse(storedTags))
    } else {
      localStorage.setItem("allTags", JSON.stringify(predefinedTags))
    }

    if (isNewNote) {
      setNote({
        id: "new",
        title: "Nueva Nota",
        content: "",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setTitle("Nueva Nota")
      setContent("")
      setTags([])
      setIsLoading(false)
      return
    }

    const loadNote = async () => {
      try {
        // Simulación de carga de nota
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Notas de ejemplo con etiquetas
        const exampleNotes: Record<string, Note> = {
          "1": {
            id: "1",
            title: "Bienvenido a NotesApp",
            content: "Esta es tu primera nota. Puedes editarla o crear nuevas notas.",
            tags: [predefinedTags[1], predefinedTags[5]],
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date(Date.now() - 86400000 * 2),
          },
          "2": {
            id: "2",
            title: "Cómo usar la edición colaborativa",
            content: "Puedes editar notas simultáneamente con otros usuarios. Si hay conflictos, podrás resolverlos.",
            tags: [predefinedTags[0], predefinedTags[4]],
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(Date.now() - 86400000),
            isBeingEdited: true,
            editedBy: "otro@usuario.com",
          },
          "3": {
            id: "3",
            title: "Ideas para proyectos",
            content: "Lista de ideas para futuros proyectos...",
            tags: [predefinedTags[3], predefinedTags[4]],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          "4": {
            id: "4",
            title: "Nueva nota guardada",
            content: "Contenido de la nueva nota guardada.",
            tags: [predefinedTags[7]],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }

        // Obtener la nota según el ID
        const exampleNote = exampleNotes[id] || {
          id,
          title: "Nota",
          content: "Contenido de la nota",
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        setNote(exampleNote)
        setTitle(exampleNote.title)
        setContent(exampleNote.content)
        setTags(exampleNote.tags)
      } catch (error) {
        navigate("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadNote()

    // Simulación de conflicto después de 10 segundos para la nota 2
    if (id === "2") {
      const conflictTimeout = setTimeout(() => {
        setHasConflict(true)
        setConflictData({
          title: "Cómo usar la edición colaborativa (actualizado)",
          content:
            "Esta nota ha sido modificada por otro usuario mientras la estabas editando. Puedes fusionar los cambios, descartar tus cambios o intentar guardar de nuevo.",
          tags: [...predefinedTags.slice(0, 2), predefinedTags[6]],
        })
        setShowConflictModal(true)
      }, 10000)

      return () => clearTimeout(conflictTimeout)
    }
  }, [id, isNewNote, router])

  // Detectar tamaño de pantalla para decidir si mostrar como modal
  useEffect(() => {
    const checkScreenSize = () => {
      setShowAsModal(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Guardar automáticamente después de 2 segundos de inactividad
  useEffect(() => {
    if (isLoading || isNewNote) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (title !== note?.title || content !== note?.content || JSON.stringify(tags) !== JSON.stringify(note?.tags)) {
        saveNote(false)
      }
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, tags])

  // Manejar cambio de etiquetas
  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags)

    // Actualizar la lista global de etiquetas
    const updatedAllTags = [...allTags]

    // Agregar nuevas etiquetas a la lista global
    newTags.forEach((tag) => {
      if (!updatedAllTags.some((t) => t.id === tag.id)) {
        updatedAllTags.push(tag)
      }
    })

    setAllTags(updatedAllTags)
    localStorage.setItem("allTags", JSON.stringify(updatedAllTags))
  }

  // Guardar nota
  const saveNote = async (showToast = true) => {
    if (isSaving) return

    setIsSaving(true)

    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedNote = {
        ...note!,
        title,
        content,
        tags,
        updatedAt: new Date(),
      }

      setNote(updatedNote)

      if (isNewNote) {
        // Redirigir a la nota recién creada (simulado con ID 4)
        navigate("/notes/4")
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setIsSaving(false)
    }
  }

  // Resolver conflicto
  const resolveConflict = (action: "merge" | "discard" | "retry") => {
    if (!conflictData) return

    switch (action) {
      case "merge":
        // Fusionar cambios (tomamos el título y las etiquetas del conflicto, pero mantenemos nuestro contenido)
        setTitle(conflictData.title)

        // Fusionar etiquetas (unir ambas listas sin duplicados)
        const mergedTags = [...tags]
        conflictData.tags.forEach((tag) => {
          if (!mergedTags.some((t) => t.id === tag.id)) {
            mergedTags.push(tag)
          }
        })
        setTags(mergedTags)
        break
      case "discard":
        // Descartar nuestros cambios
        setTitle(conflictData.title)
        setContent(conflictData.content)
        setTags(conflictData.tags)
        break
      case "retry":
        // Intentar guardar de nuevo
        break
    }

    setHasConflict(false)
    setShowConflictModal(false)
    setConflictData(null)
  }

  // Volver al dashboard
  const goBack = () => {
    navigate("/dashboard")
  }

  // Contenido del editor
  const EditorContent = () => {
    if (!note) return null

    return (
      <>
        {hasConflict && showConflictModal && (
          <Card className="mb-6 border-yellow-500">
            <CardContent className="p-4">
              <Alert className="border-yellow-500">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Conflicto de edición</AlertTitle>
                <AlertDescription>
                  Esta nota ha sido modificada por otro usuario mientras la estabas editando.
                </AlertDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => resolveConflict("merge")} variant="outline" size="sm">
                    <GitMerge className="mr-2 h-4 w-4" /> Fusionar cambios
                  </Button>
                  <Button onClick={() => resolveConflict("discard")} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" /> Descartar mis cambios
                  </Button>
                  <Button onClick={() => resolveConflict("retry")} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
                  </Button>
                </div>
              </Alert>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Título de la nota"
            />
          </div>
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[40vh] resize-none"
              placeholder="Escribe tu nota aquí..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Etiquetas</label>
            <TagInput
              tags={allTags}
              selectedTags={tags}
              onTagsChange={handleTagsChange}
              placeholder="Agregar etiquetas..."
            />
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <Providers>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 text-xl font-bold">Cargando...</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 flex justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-[40%] min-w-[300px]">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </main>
        </div>
      </Providers>
    )
  }

  // Versión Modal para pantallas pequeñas
  if (showAsModal) {
    return (
      <Providers>
        <Dialog open={true} onOpenChange={() => navigate("/dashboard")}>
          <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" onClick={goBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {note?.title}
              </DialogTitle>
              <DialogDescription>Edita tu nota y guarda los cambios</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EditorContent />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => saveNote(true)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Providers>
    )
  }

  // Versión centrada para pantallas grandes
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 text-xl font-bold">{note?.title}</h1>
          </div>
          <Button onClick={() => saveNote(true)} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 flex justify-center">
          <Card className="w-full max-w-[40%] min-w-[400px]">
            <CardHeader>
              <CardTitle>Editor de Nota</CardTitle>
              <CardDescription>Edita tu nota y guarda los cambios</CardDescription>
            </CardHeader>
            <CardContent>
              <EditorContent />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => saveNote(true)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </Providers>
  )
}

