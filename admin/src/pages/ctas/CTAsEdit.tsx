/**
 * CTAs Edit Page
 * 
 * Form for editing an existing CTA.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CTAButton {
  text: string;
  href: string;
  variant?: string;
}

interface CTAFormData {
  page_slug: string;
  headline: string;
  subheadline?: string;
  buttons: CTAButton[];
  is_active?: boolean;
}

interface CTAsEditProps {
  id: string;
}

export function CTAsEdit({ id }: CTAsEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<CTAFormData>({
    page_slug: "",
    headline: "",
    subheadline: "",
    buttons: [{ text: "", href: "", variant: "primary" }],
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("ctas");
  };

  const handleChange = (field: keyof CTAFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleButtonChange = (index: number, field: keyof CTAButton, value: string) => {
    const newButtons = [...formData.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setFormData(prev => ({ ...prev, buttons: newButtons }));
  };

  const addButton = () => {
    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: "", href: "", variant: "primary" }],
    }));
  };

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar CTA</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Page Slug *</label>
          <Input
            value={formData.page_slug}
            onChange={(e) => handleChange("page_slug", e.target.value)}
            placeholder="inicio, servicios, contacto"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Headline *</label>
          <Input
            value={formData.headline}
            onChange={(e) => handleChange("headline", e.target.value)}
            placeholder="Protege lo que más importa"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subheadline</label>
          <Textarea
            value={formData.subheadline}
            onChange={(e) => handleChange("subheadline", e.target.value)}
            placeholder="Descripción breve del llamado a la acción..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Botones</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addButton}
            >
              + Agregar Botón
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.buttons.map((button, index) => (
              <div key={index} className="flex gap-2 items-start p-3 border rounded-md">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                    placeholder="Texto"
                  />
                  <Input
                    value={button.href}
                    onChange={(e) => handleButtonChange(index, "href", e.target.value)}
                    placeholder="URL"
                  />
                  <Input
                    value={button.variant}
                    onChange={(e) => handleButtonChange(index, "variant", e.target.value)}
                    placeholder="primary"
                  />
                </div>
                {formData.buttons.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeButton(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
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
            CTA activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("ctas")}
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
