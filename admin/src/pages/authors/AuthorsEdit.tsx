/**
 * Authors Edit Page
 * 
 * Form for editing an existing author.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AuthorFormData {
  name: string;
  bio?: string;
  image?: string;
  email?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
  };
  order?: number;
  is_active?: boolean;
}

interface AuthorsEditProps {
  id: string;
}

export function AuthorsEdit({ id }: AuthorsEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<AuthorFormData>({
    name: "",
    bio: "",
    image: "",
    email: "",
    social_links: {
      twitter: "",
      linkedin: "",
    },
    order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("authors");
  };

  const handleChange = (field: keyof AuthorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: "twitter" | "linkedin", value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Autor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre *</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Biografía</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Biografía del autor..."
            rows={4}
          />
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
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter</label>
            <Input
              value={formData.social_links?.twitter || ""}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="@username"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn</label>
            <Input
              value={formData.social_links?.linkedin || ""}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            Autor activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("authors")}
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
