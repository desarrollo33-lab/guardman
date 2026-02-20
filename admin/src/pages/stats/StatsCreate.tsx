/**
 * Stats Create Page
 * 
 * Form for creating a new stat.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StatsFormData {
  value: string;
  label: string;
  icon?: string;
  page_slug?: string;
  order?: number;
  is_active?: boolean;
}

export function StatsCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<StatsFormData>({
    value: "",
    label: "",
    icon: "",
    page_slug: "",
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "stats",
      values: formData,
    }, {
      onSuccess: () => {
        list("stats");
      },
    });
  };

  const handleChange = (field: keyof StatsFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Stat</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor *</label>
            <Input
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="500+"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Etiqueta *</label>
            <Input
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Clientes satisfechos"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Icono</label>
            <Input
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="users"
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
          <label className="text-sm font-medium">Página</label>
          <Input
            value={formData.page_slug}
            onChange={(e) => handleChange("page_slug", e.target.value)}
            placeholder="inicio"
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
            Stat activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("stats")}
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
