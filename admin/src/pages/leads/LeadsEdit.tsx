/**
 * Leads Edit Page
 * 
 * Form for editing an existing lead.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LeadFormData {
  nombre: string;
  telefono: string;
  email?: string;
  servicio: string;
  ciudad?: string;
  mensaje?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status?: string;
  is_active?: boolean;
}

interface LeadsEditProps {
  id: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Nuevo" },
  { value: "contacted", label: "Contactado" },
  { value: "qualified", label: "Calificado" },
  { value: "converted", label: "Convertido" },
  { value: "lost", label: "Perdido" },
];

export function LeadsEdit({ id }: LeadsEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<LeadFormData>({
    nombre: "",
    telefono: "",
    email: "",
    servicio: "",
    ciudad: "",
    mensaje: "",
    source: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    status: "new",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("leads");
  };

  const handleChange = (field: keyof LeadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Lead</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre *</label>
            <Input
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono *</label>
            <Input
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="+56 9 1234 5678"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="juan@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Servicio *</label>
            <Input
              value={formData.servicio}
              onChange={(e) => handleChange("servicio", e.target.value)}
              placeholder="Guardias de Seguridad"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad</label>
          <Input
            value={formData.ciudad}
            onChange={(e) => handleChange("ciudad", e.target.value)}
            placeholder="Santiago"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mensaje</label>
          <Textarea
            value={formData.mensaje}
            onChange={(e) => handleChange("mensaje", e.target.value)}
            placeholder="Mensaje del lead..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fuente</label>
          <Input
            value={formData.source}
            onChange={(e) => handleChange("source", e.target.value)}
            placeholder="web, formulario, referencia, etc."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">UTM Source</label>
            <Input
              value={formData.utm_source}
              onChange={(e) => handleChange("utm_source", e.target.value)}
              placeholder="google"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">UTM Medium</label>
            <Input
              value={formData.utm_medium}
              onChange={(e) => handleChange("utm_medium", e.target.value)}
              placeholder="cpc"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">UTM Campaign</label>
            <Input
              value={formData.utm_campaign}
              onChange={(e) => handleChange("utm_campaign", e.target.value)}
              placeholder="seguridad_2024"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 flex items-end pb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Lead activo
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("leads")}
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
