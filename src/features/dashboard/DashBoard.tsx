"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, TagIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Providers } from "../../provider/Providers"
import type { Tag } from '@/components/tag-input'


// Tipo para las notas
interface Note {
  id: string
  title: string
  content: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
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

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [allTags, setAllTags] = useState<Tag[]>(predefinedTags)
  const navigate = useNavigate();


  // Verificar si el usuario está autenticado
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

    // Cargar notas (simulado)
    const loadNotes = async () => {
      try {
        // Simulación de carga de notas
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Notas de ejemplo con etiquetas
        const exampleNotes: Note[] = [
          {
            id: "1",
            title: "Bienvenido a NotesApp",
            content: "Esta es tu primera nota. Puedes editarla o crear nuevas notas.",
            tags: [predefinedTags[1], predefinedTags[5]],
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date(Date.now() - 86400000 * 2),
          },
          {
            id: "2",
            title: "Cómo usar la edición colaborativa",
            content: "Puedes editar notas simultáneamente con otros usuarios. Si hay conflictos, podrás resolverlos.",
            tags: [predefinedTags[0], predefinedTags[4]],
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(Date.now() - 86400000),
          },
          {
            id: "3",
            title: "Ideas para proyectos",
            content: "Lista de ideas para futuros proyectos...",
            tags: [predefinedTags[3], predefinedTags[4]],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]

        setNotes(exampleNotes)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [navigate])

  // Filtrar notas según la búsqueda y etiqueta seleccionada
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag ? note.tags.some((tag) => tag.id === selectedTag) : true

    return matchesSearch && matchesTag
  })

  // Crear nueva nota
  const createNewNote = () => {
    // Detectar si estamos en móvil para decidir si usar modal o página completa
    if (window.innerWidth < 768) {
      setShowNewNoteModal(true)
    } else {
      navigate("/notes/new")
    }
  }

  // Editar nota
  const editNote = (id: string) => {
    navigate(`/notes/${id}`)
  }

  // Eliminar nota
  const deleteNote = async (id: string) => {
    try {
      // Simulación de eliminación
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotes(notes.filter((note) => note.id !== id))
    } catch (error) {
      console.log(error)

    }
  }

  // Filtrar por etiqueta
  const filterByTag = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId)
  }

  // Obtener todas las etiquetas únicas de las notas
  const getUniqueTags = () => {
    const uniqueTags: Tag[] = []
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        if (!uniqueTags.some((t) => t.id === tag.id)) {
          uniqueTags.push(tag)
        }
      })
    })
    return uniqueTags
  }

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">NotesApp</h1>
          <Button variant="ghost" onClick={logout}>
            Cerrar Sesión
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar notas..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={createNewNote}>
              <Plus className="mr-2 h-4 w-4" /> Nueva Nota
            </Button>
          </div>

          {/* Filtro de etiquetas */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtrar por etiqueta:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getUniqueTags().map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => filterByTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
              {selectedTag && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSelectedTag(null)}>
                  Limpiar filtro
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 w-3/4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="h-4 w-1/3 bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="line-clamp-3 text-sm text-muted-foreground mb-2">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => editNote(note.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No se encontraron notas</p>
              <Button onClick={createNewNote}>
                <Plus className="mr-2 h-4 w-4" /> Crear Nueva Nota
              </Button>
            </div>
          )}
        </main>

        {/* Modal para crear nueva nota en dispositivos móviles */}
        {showNewNoteModal && (
          <Dialog open={showNewNoteModal} onOpenChange={setShowNewNoteModal}>
            <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%]">
              <DialogHeader>
                <DialogTitle>Nueva Nota</DialogTitle>
                <DialogDescription>Crea una nueva nota</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <Input type="text" className="text-xl font-bold" placeholder="Título de la nota" />
                  </div>
                  <div>
                    <Textarea className="min-h-[40vh] resize-none" placeholder="Escribe tu nota aquí..." />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewNoteModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowNewNoteModal(false)
                    navigate("/notes/new")
                  }}
                >
                  Continuar Editando
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Providers>
  )
}

