/**
 * Partners Create Page
 * 
 * Form for creating a new partner.
 */

import { useCreate, useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PartnerFormData {
  name: string;
  logo_url?: string;
  type?: string;
  website?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export function PartnersCreate() {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();

  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    logo_url: "",
    type: "",
    website: "",
    description: "",
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    create({
      resource: "partners",
      values: formData,
    }, {
      onSuccess: () => {
        list("partners");
      },
    });
  };

  const handleChange = (field: keyof PartnerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Crear Partner</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre *</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nombre del partner"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Logo URL</label>
          <Input
            value={formData.logo_url}
            onChange={(e) => handleChange("logo_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Input
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="cliente, certificación, socio..."
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
          <label className="text-sm font-medium">Website</label>
          <Input
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción del partner..."
            rows={3}
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
            Partner activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("partners")}
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
