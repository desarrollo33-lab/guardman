/**
 * Stats Edit Page
 * 
 * Form for editing an existing stat.
 */

import { useNavigation, useUpdate } from "@refinedev/core";
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

interface StatsEditProps {
  id: string;
}

export function StatsEdit({ id }: StatsEditProps) {
  const { list } = useNavigation();
  const { mutate: update } = useUpdate();

  const [formData, setFormData] = useState<StatsFormData>({
    value: "",
    label: "",
    icon: "",
    page_slug: "",
    order: 0,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    update({
      resource: "stats",
      id: id,
      values: formData,
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        list("stats");
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleChange = (field: keyof StatsFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Stat</h1>
      
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
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
