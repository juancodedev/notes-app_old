"use client"

import * as React from "react"
import { X, Plus, TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Tag = {
  id: string
  name: string
  color?: string
}

interface TagInputProps {
  tags: Tag[]
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  disabled?: boolean
}

export function TagInput({
  tags,
  selectedTags,
  onTagsChange,
  placeholder = "Agregar etiquetas...",
  disabled = false,
}: TagInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (tag: Tag) => {
    onTagsChange(selectedTags.filter((s) => s.id !== tag.id))
  }

  const handleSelect = (tag: Tag) => {
    if (selectedTags.some((s) => s.id === tag.id)) {
      onTagsChange(selectedTags.filter((s) => s.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
    setInputValue("")
  }

  const handleCreateTag = () => {
    if (!inputValue.trim()) return

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: inputValue.trim(),
      color: getRandomColor(),
    }

    onTagsChange([...selectedTags, newTag])
    setInputValue("")
  }

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const availableTags = tags.filter((tag) => !selectedTags.some((s) => s.id === tag.id))

  const allTags = [...availableTags, ...selectedTags]

  const filteredTags = allTags.filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className={cn("flex items-center gap-1", tag.color ? "border-l-4" : "")}
            style={tag.color ? { borderLeftColor: `var(--${tag.color.replace("bg-", "")})` } : undefined}
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleUnselect(tag)}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 justify-start text-muted-foreground" disabled={disabled}>
            <TagIcon className="mr-2 h-4 w-4" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar o crear etiqueta..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>
                <div className="flex items-center justify-between p-2">
                  <span>No se encontraron etiquetas</span>
                  <Button variant="ghost" size="sm" className="h-8" onClick={handleCreateTag}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear "{inputValue}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag)}>
                    <div className={cn("mr-2 h-3 w-3 rounded-full", tag.color || "bg-gray-500")} />
                    {tag.name}
                    {selectedTags.some((s) => s.id === tag.id) && (
                      <span className="ml-auto text-xs text-muted-foreground">Seleccionada</span>
                    )}
                  </CommandItem>
                ))}
                {inputValue && !filteredTags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
                  <CommandItem onSelect={handleCreateTag}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear "{inputValue}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

