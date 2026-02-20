/**
 * Solutions Create Page
 * 
 * Form for creating a new security solution.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SolutionFormData {
  slug: string;
  title?: string;
  description: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  cta?: string;
  industries?: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  image?: string;
  image_alt?: string;
  image_storage_id?: string;
  challenges?: string[];
  relatedServices?: string[];
  is_active?: boolean;
  order?: number;
  // Legacy fields
  id?: string;
  solutions?: string[];
}

export function SolutionsCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<SolutionFormData>({
    slug: "",
    title: "",
    description: "",
    icon: "",
    features: [],
    benefits: [],
    cta: "",
    industries: [],
    meta_title: "",
    meta_description: "",
    og_image: "",
    image: "",
    image_alt: "",
    challenges: [],
    relatedServices: [],
    is_active: true,
    order: 0,
  });

  // Helper to convert comma-separated string to array
  const parseArrayField = (value: string): string[] => {
    if (!value.trim()) return [];
    return value.split(",").map(item => item.trim()).filter(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "solutions",
      values: formData,
    }, {
      onSuccess: () => {
        list("solutions");
      },
    });
  };

  const handleChange = (field: keyof SolutionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for comma-separated array fields
  const handleArrayChange = (field: keyof SolutionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: parseArrayField(value) }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Solución</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Seguridad para Empresas"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="seguridad-empresas"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción de la solución..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icono</label>
          <Input
            value={formData.icon}
            onChange={(e) => handleChange("icon", e.target.value)}
            placeholder="shield"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Características (separadas por coma)</label>
          <Input
            value={formData.features?.join(", ") || ""}
            onChange={(e) => handleArrayChange("features", e.target.value)}
            placeholder="Característica 1, Característica 2, Característica 3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Beneficios (separados por coma)</label>
          <Input
            value={formData.benefits?.join(", ") || ""}
            onChange={(e) => handleArrayChange("benefits", e.target.value)}
            placeholder="Beneficio 1, Beneficio 2, Beneficio 3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">CTA (Call to Action)</label>
          <Input
            value={formData.cta}
            onChange={(e) => handleChange("cta", e.target.value)}
            placeholder="Contratar ahora"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Industrias (separadas por coma)</label>
          <Input
            value={formData.industries?.join(", ") || ""}
            onChange={(e) => handleArrayChange("industries", e.target.value)}
            placeholder="Retail, Construcción, Logística"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Desafíos (separados por coma)</label>
          <Textarea
            value={formData.challenges?.join(", ") || ""}
            onChange={(e) => handleArrayChange("challenges", e.target.value)}
            placeholder="Desafío 1, Desafío 2, Desafío 3"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Servicios Relacionados (separados por coma)</label>
          <Input
            value={formData.relatedServices?.join(", ") || ""}
            onChange={(e) => handleArrayChange("relatedServices", e.target.value)}
            placeholder="servicio-1, servicio-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Orden</label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Imagen URL</label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alt Imagen</label>
          <Input
            value={formData.image_alt}
            onChange={(e) => handleChange("image_alt", e.target.value)}
            placeholder="Descripción de la imagen"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">OG Image URL</label>
          <Input
            value={formData.og_image}
            onChange={(e) => handleChange("og_image", e.target.value)}
            placeholder="https://... (imagen para redes sociales)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={formData.meta_title}
            onChange={(e) => handleChange("meta_title", e.target.value)}
            placeholder="Soluciones de seguridad..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Description</label>
          <Textarea
            value={formData.meta_description}
            onChange={(e) => handleChange("meta_description", e.target.value)}
            placeholder="Descripción para SEO..."
            rows={2}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Solución activa
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("solutions")}
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
