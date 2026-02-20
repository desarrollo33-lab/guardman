/**
 * Process Steps Create Page
 * 
 * Form for creating a new process step.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProcessStepFormData {
  page_slug: string;
  title: string;
  description: string;
  icon?: string;
  number?: number;
  order?: number;
  is_active?: boolean;
}

export function ProcessStepsCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<ProcessStepFormData>({
    page_slug: "",
    title: "",
    description: "",
    icon: "",
    number: 1,
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "process_steps",
      values: formData,
    }, {
      onSuccess: () => {
        list("process_steps");
      },
    });
  };

  const handleChange = (field: keyof ProcessStepFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Paso del Proceso</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Página *</label>
            <Input
              value={formData.page_slug}
              onChange={(e) => handleChange("page_slug", e.target.value)}
              placeholder="home, about, servicios"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Número</label>
            <Input
              type="number"
              value={formData.number}
              onChange={(e) => handleChange("number", parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Evaluación de Riesgos"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción del paso del proceso..."
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Icono</label>
            <Input
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="shield-check"
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Paso activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("process_steps")}
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
