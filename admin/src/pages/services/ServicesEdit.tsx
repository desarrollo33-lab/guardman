/**
 * Services Edit Page - Simplified Version
 * 
 * Form for editing an existing service.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormData {
  slug: string;
  title: string;
  description: string;
  tagline?: string;
  icon?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  order?: number;
}

interface ServicesEditProps {
  id: string;
}

export function ServicesEdit({ id }: ServicesEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<ServiceFormData>({
    slug: "",
    title: "",
    description: "",
    tagline: "",
    icon: "",
    image: "",
    meta_title: "",
    meta_description: "",
    is_active: true,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("services");
  };

  const handleChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Servicio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Guardias de Seguridad"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="guardias-seguridad"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción del servicio..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tagline</label>
          <Input
            value={formData.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            placeholder="Protección profesional 24/7"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Icono</label>
            <Input
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="shield"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Orden</label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Imagen URL</label>
          <Input
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={formData.meta_title}
            onChange={(e) => handleChange("meta_title", e.target.value)}
            placeholder="Servicios de seguridad..."
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
            Servicio activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("services")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
