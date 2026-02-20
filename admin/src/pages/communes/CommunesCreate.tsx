/**
 * Communes Create Page
 * 
 * Form for creating a new commune.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CommuneFormData {
  name: string;
  slug: string;
  zone: string;
  meta_title?: string;
  meta_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  intro_content?: string;
  order?: number;
  is_published?: boolean;
  latitude?: number;
  longitude?: number;
  population?: number;
  unique_content?: string;
  is_active?: boolean;
}

export function CommunesCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<CommuneFormData>({
    name: "",
    slug: "",
    zone: "",
    meta_title: "",
    meta_description: "",
    hero_title: "",
    hero_subtitle: "",
    intro_content: "",
    order: 0,
    is_published: false,
    latitude: undefined,
    longitude: undefined,
    population: undefined,
    unique_content: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "communes",
      values: formData,
    }, {
      onSuccess: () => {
        list("communes");
      },
    });
  };

  const handleChange = (field: keyof CommuneFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Comuna</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Santiago Centro"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="santiago-centro"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="textsm font-medium">Zona *</label>
          <Input
            value={formData.zone}
            onChange={(e) => handleChange("zone", e.target.value)}
            placeholder="Metropolitana"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hero Título</label>
          <Input
            value={formData.hero_title}
            onChange={(e) => handleChange("hero_title", e.target.value)}
            placeholder="Servicios de seguridad en Santiago Centro"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hero Subtítulo</label>
          <Input
            value={formData.hero_subtitle}
            onChange={(e) => handleChange("hero_subtitle", e.target.value)}
            placeholder="Protección profesional para tu hogar y empresa"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contenido de Introducción</label>
          <Textarea
            value={formData.intro_content}
            onChange={(e) => handleChange("intro_content", e.target.value)}
            placeholder="Introducción sobre los servicios de seguridad en esta comuna..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contenido Único</label>
          <Textarea
            value={formData.unique_content}
            onChange={(e) => handleChange("unique_content", e.target.value)}
            placeholder="Contenido específico y único para esta comuna..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Latitud</label>
            <Input
              type="number"
              step="any"
              value={formData.latitude ?? ""}
              onChange={(e) => handleChange("latitude", e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="-33.4489"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Longitud</label>
            <Input
              type="number"
              step="any"
              value={formData.longitude ?? ""}
              onChange={(e) => handleChange("longitude", e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="-70.6693"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Población</label>
            <Input
              type="number"
              value={formData.population ?? ""}
              onChange={(e) => handleChange("population", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="200000"
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
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={formData.meta_title}
            onChange={(e) => handleChange("meta_title", e.target.value)}
            placeholder="Servicios de seguridad en Santiago..."
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

        <div className="flex items-center gap-6 space-y-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Comuna activa
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
              Publicada
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("communes")}
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
