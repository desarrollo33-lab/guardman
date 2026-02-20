/**
 * Blog Posts Edit Page
 * 
 * Form for editing an existing blog post.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContentBlock {
  type: string;
  content: string;
  alt?: string;
  caption?: string;
  items?: string[];
}

interface BlogPostFormData {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  author: string;
  author_id?: string;
  published_at: number;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  content: ContentBlock[];
  seo_title?: string;
  seo_description?: string;
}

interface BlogPostsEditProps {
  id: string;
}

export function BlogPostsEdit({ id }: BlogPostsEditProps) {
  const { list } = useNavigation();

  const [formData, setFormData] = useState<BlogPostFormData>({
    slug: "",
    title: "",
    excerpt: "",
    cover_image: "",
    author: "",
    author_id: undefined,
    published_at: Date.now(),
    read_time: 5,
    tags: [],
    is_featured: false,
    is_published: false,
    content: [],
    seo_title: "",
    seo_description: "",
  });

  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: For a full implementation, you would use useOne to fetch the existing data
  // and useUpdate to save changes. For now, this follows the pattern from ServicesEdit.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Parse tags from comma-separated string
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Use the Convex data provider through Refine's mutation
    // For now, we just navigate back (full implementation would use useUpdate)
    console.log("Saving blog post:", { ...formData, tags, id });
    
    setTimeout(() => {
      setIsSubmitting(false);
      list("blog_posts");
    }, 500);
  };

  const handleChange = (field: keyof BlogPostFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Título del artículo"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="mi-articulo"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Extracto *</label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            placeholder="Breve descripción del artículo..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">URL de Imagen de Cover *</label>
          <Input
            value={formData.cover_image}
            onChange={(e) => handleChange("cover_image", e.target.value)}
            placeholder="https://..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Autor *</label>
            <Input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="Nombre del autor"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tiempo de lectura (minutos) *</label>
            <Input
              type="number"
              value={formData.read_time}
              onChange={(e) => handleChange("read_time", parseInt(e.target.value) || 5)}
              min={1}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Etiquetas (separadas por coma)</label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="seguridad, guardias, protección"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contenido (JSON)</label>
          <Textarea
            value={JSON.stringify(formData.content, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange("content", parsed);
              } catch {
                // Allow invalid JSON while typing
              }
            }}
            placeholder='[{"type": "text", "content": "..."}]'
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SEO Title</label>
          <Input
            value={formData.seo_title}
            onChange={(e) => handleChange("seo_title", e.target.value)}
            placeholder="Título para SEO..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SEO Description</label>
          <Textarea
            value={formData.seo_description}
            onChange={(e) => handleChange("seo_description", e.target.value)}
            placeholder="Descripción para SEO..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => handleChange("is_featured", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Destacado
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => handleChange("is_published", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_published" className="text-sm font-medium">
              Publicar
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("blog_posts")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
