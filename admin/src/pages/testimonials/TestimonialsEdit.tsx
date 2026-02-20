/**
 * Testimonials Edit Page
 * 
 * Form for editing an existing testimonial.
 */

import { useNavigation, useUpdate } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialFormData {
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image_url?: string;
  verified: boolean;
  order: number;
  is_active: boolean;
}

interface TestimonialsEditProps {
  id: string;
}

export function TestimonialsEdit({ id }: TestimonialsEditProps) {
  const { list } = useNavigation();
  const { mutate: update } = useUpdate();
  
  const [formData, setFormData] = useState<TestimonialFormData>({
    author: "",
    role: "",
    company: "",
    quote: "",
    rating: 5,
    image_url: "",
    verified: false,
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    update({
      resource: "testimonials",
      id: id,
      values: formData,
    }, {
      onSuccess: () => {
        list("testimonials");
      },
    });
  };

  const handleChange = (field: keyof TestimonialFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Testimonio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Autor *</label>
          <Input
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cargo</label>
            <Input
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="Gerente de Seguridad"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Empresa</label>
            <Input
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Testimonio *</label>
          <Textarea
            value={formData.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
            placeholder="Excelente servicio de seguridad..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={formData.rating}
              onChange={(e) => handleChange("rating", parseInt(e.target.value) || 5)}
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
          <label className="text-sm font-medium">URL de Imagen</label>
          <Input
            value={formData.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) => handleChange("verified", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="verified" className="text-sm font-medium">
              Verificado
            </label>
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
              Activo
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("testimonials")}
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
