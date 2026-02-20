/**
 * Site Config Edit Page
 * 
 * Form for editing site configuration (singleton).
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
}

interface NavbarItem {
  label: string;
  href?: string;
  is_button?: boolean;
  children?: { label: string; href: string }[];
}

interface SiteConfigFormData {
  is_active: boolean;
  brand_name: string;
  phone_primary: string;
  phone_secondary?: string;
  whatsapp_number: string;
  email_contact: string;
  address_main?: string;
  social_links: SocialLinks;
  navbar_items: NavbarItem[];
}

interface SiteConfigEditProps {
  id: string;
}

export function SiteConfigEdit({ id }: SiteConfigEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<SiteConfigFormData>({
    is_active: true,
    brand_name: "",
    phone_primary: "",
    phone_secondary: "",
    whatsapp_number: "",
    email_contact: "",
    address_main: "",
    social_links: {
      instagram: "",
      linkedin: "",
      facebook: "",
      youtube: "",
    },
    navbar_items: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("site_config");
  };

  const handleChange = (field: keyof SiteConfigFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [field]: value },
    }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Configuración del Sitio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Información Basic</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la Marca *</label>
            <Input
              value={formData.brand_name}
              onChange={(e) => handleChange("brand_name", e.target.value)}
              placeholder="Guardman Chile"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Información de Contacto</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono Principal *</label>
              <Input
                value={formData.phone_primary}
                onChange={(e) => handleChange("phone_primary", e.target.value)}
                placeholder="+56 2 2123 4567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono Secundario</label>
              <Input
                value={formData.phone_secondary}
                onChange={(e) => handleChange("phone_secondary", e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp *</label>
              <Input
                value={formData.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+56 9 1234 5678"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email de Contacto *</label>
              <Input
                type="email"
                value={formData.email_contact}
                onChange={(e) => handleChange("email_contact", e.target.value)}
                placeholder="contacto@guardman.cl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dirección</label>
            <Input
              value={formData.address_main}
              onChange={(e) => handleChange("address_main", e.target.value)}
              placeholder="Av. Libertador Bernardo O'Higgins 1449"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Redes Sociales</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram</label>
              <Input
                value={formData.social_links.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn</label>
              <Input
                value={formData.social_links.linkedin}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook</label>
              <Input
                value={formData.social_links.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube</label>
              <Input
                value={formData.social_links.youtube}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Configuración activa
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("site_config")}
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
