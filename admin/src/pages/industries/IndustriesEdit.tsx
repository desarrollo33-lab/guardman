/**
 * Industries Edit Page
 * 
 * Form for editing an existing industry.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface IndustryFormData {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
  image?: string;
  image_alt?: string;
  challenges?: string[];
  relatedServices?: string[];
  meta_title?: string;
  meta_description?: string;
}

interface IndustriesEditProps {
  id: string;
}

export function IndustriesEdit({ id }: IndustriesEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<IndustryFormData>({
    name: "",
    slug: "",
    icon: "",
    description: "",
    order: 0,
    is_active: true,
    image: "",
    image_alt: "",
    challenges: [],
    relatedServices: [],
    meta_title: "",
    meta_description: "",
  });

  const [challengesInput, setChallengesInput] = useState("");
  const [relatedServicesInput, setRelatedServicesInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse array fields
    const values = {
      ...formData,
      challenges: challengesInput 
        ? challengesInput.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      relatedServices: relatedServicesInput
        ? relatedServicesInput.split(",").map(s => s.trim()).filter(Boolean)
        : [],
    };

    // TODO: Implement update mutation using useUpdate
    console.log("Updating industry:", id, values);
    list("industries");
  };

  const handleChange = (field: keyof IndustryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Industria</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Retail y Comercio"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="retail-comercio"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción de la industria..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Icono</label>
            <Input
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="store"
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
          <label className="text-sm font-medium">Texto Alternativo de Imagen</label>
          <Input
            value={formData.image_alt}
            onChange={(e) => handleChange("image_alt", e.target.value)}
            placeholder="Seguridad en retail"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Desafíos (separados por coma)</label>
          <Input
            value={challengesInput}
            onChange={(e) => setChallengesInput(e.target.value)}
            placeholder="Hurto, seguridad perimetral, control de acceso"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Servicios Relacionados (separados por coma)</label>
          <Input
            value={relatedServicesInput}
            onChange={(e) => setRelatedServicesInput(e.target.value)}
            placeholder="Guardias de seguridad, CCTV, alarmas"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={formData.meta_title}
            onChange={(e) => handleChange("meta_title", e.target.value)}
            placeholder="Seguridad para industrias..."
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
            Industria activa
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("industries")}
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
