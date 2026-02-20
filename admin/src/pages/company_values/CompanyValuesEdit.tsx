/**
 * Company Values Edit Page
 * 
 * Form for editing an existing company value.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CompanyValueFormData {
  title: string;
  description: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
}

interface CompanyValuesEditProps {
  id: string;
}

export function CompanyValuesEdit({ id }: CompanyValuesEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<CompanyValueFormData>({
    title: "",
    description: "",
    icon: "",
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("company_values");
  };

  const handleChange = (field: keyof CompanyValueFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Valor Corporativo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Integridad"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción del valor corporativo..."
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Valor activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("company_values")}
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
