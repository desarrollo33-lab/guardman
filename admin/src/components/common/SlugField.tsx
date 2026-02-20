import * as React from "react"
import slugify from "slugify"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link2, RefreshCw } from "lucide-react"

interface SlugFieldProps {
  value: string
  onChange: (value: string) => void
  source?: string
  sourceValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
}

export function SlugField({
  value,
  onChange,
  source = "title",
  sourceValue = "",
  label = "Slug",
  placeholder = "url-friendly-slug",
  disabled = false,
}: SlugFieldProps) {
  const [isManualEdit, setIsManualEdit] = React.useState(false)

  const generateSlug = React.useCallback(
    (text: string): string => {
      return slugify(text, {
        lower: true,
        strict: true,
        locale: "es",
      })
    },
    []
  )

  const handleSourceChange = React.useCallback(
    (newSourceValue: string) => {
      if (!isManualEdit && newSourceValue) {
        const newSlug = generateSlug(newSourceValue)
        onChange(newSlug)
      }
    },
    [isManualEdit, generateSlug, onChange]
  )

  React.useEffect(() => {
    if (sourceValue && !isManualEdit) {
      handleSourceChange(sourceValue)
    }
  }, [sourceValue])

  const handleRegenerate = () => {
    if (sourceValue) {
      const newSlug = generateSlug(sourceValue)
      onChange(newSlug)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualEdit(true)
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="slug-field">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="slug-field"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className="pl-9 font-mono text-sm"
          />
        </div>
        {sourceValue && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRegenerate}
            disabled={disabled}
            title="Regenerar desde el título"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Se genera automáticamente desde {source}. Edita manualmente si necesitas un
        slug personalizado.
      </p>
    </div>
  )
}
