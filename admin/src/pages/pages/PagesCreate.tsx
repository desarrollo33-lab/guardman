/**
 * Pages Create Page
 * 
 * Form for creating a new page.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PageFormData {
  slug: string;
  title: string;
  description: string;
  is_published: boolean;
  show_hero: boolean;
  show_stats: boolean;
  show_testimonials: boolean;
  show_cta: boolean;
  seo_title?: string;
  seo_description?: string;
}

export function PagesCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<PageFormData>({
    slug: "",
    title: "",
    description: "",
    is_published: false,
    show_hero: true,
    show_stats: false,
    show_testimonials: false,
    show_cta: true,
    seo_title: "",
    seo_description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "pages",
      values: formData,
    }, {
      onSuccess: () => {
        list("pages");
      },
    });
  };

  const handleChange = (field: keyof PageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Página</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Título de la página"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="mi-pagina"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción de la página..."
            rows={3}
            required
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

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => handleChange("is_published", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_published" className="text-sm font-medium">
              Publicada
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show_hero"
              checked={formData.show_hero}
              onChange={(e) => handleChange("show_hero", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="show_hero" className="text-sm font-medium">
              Mostrar Hero
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show_stats"
              checked={formData.show_stats}
              onChange={(e) => handleChange("show_stats", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="show_stats" className="text-sm font-medium">
              Mostrar Stats
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show_testimonials"
              checked={formData.show_testimonials}
              onChange={(e) => handleChange("show_testimonials", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="show_testimonials" className="text-sm font-medium">
              Mostrar Testimonios
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show_cta"
            checked={formData.show_cta}
            onChange={(e) => handleChange("show_cta", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="show_cta" className="text-sm font-medium">
            Mostrar CTA
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("pages")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
