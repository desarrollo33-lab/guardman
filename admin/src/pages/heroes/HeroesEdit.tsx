/**
 * Heroes Edit Page
 * 
 * Form for editing an existing hero banner.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroCta {
  text: string;
  href: string;
  variant?: string;
}

interface HeroBadge {
  text: string;
  icon?: string;
}

interface HeroFormData {
  page_slug: string;
  title: string;
  subtitle?: string;
  background_type: "youtube" | "image";
  youtube_id?: string;
  image_url?: string;
  mobile_image_url?: string;
  ctas?: HeroCta[];
  badges?: HeroBadge[];
  is_active?: boolean;
}

interface HeroesEditProps {
  id: string;
}

export function HeroesEdit({ id }: HeroesEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<HeroFormData>({
    page_slug: "",
    title: "",
    subtitle: "",
    background_type: "image",
    youtube_id: "",
    image_url: "",
    mobile_image_url: "",
    ctas: [],
    badges: [],
    is_active: true,
  });

  const [ctaText, setCtaText] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [ctaVariant, setCtaVariant] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [badgeIcon, setBadgeIcon] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update mutation
    list("heroes");
  };

  const handleChange = (field: keyof HeroFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCta = () => {
    if (ctaText && ctaHref) {
      setFormData(prev => ({
        ...prev,
        ctas: [...(prev.ctas || []), { text: ctaText, href: ctaHref, variant: ctaVariant || undefined }],
      }));
      setCtaText("");
      setCtaHref("");
      setCtaVariant("");
    }
  };

  const removeCta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas?.filter((_, i) => i !== index) || [],
    }));
  };

  const addBadge = () => {
    if (badgeText) {
      setFormData(prev => ({
        ...prev,
        badges: [...(prev.badges || []), { text: badgeText, icon: badgeIcon || undefined }],
      }));
      setBadgeText("");
      setBadgeIcon("");
    }
  };

  const removeBadge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Editar Hero Banner</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug de Página *</label>
            <Input
              value={formData.page_slug}
              onChange={(e) => handleChange("page_slug", e.target.value)}
              placeholder="home, servicios, contacto"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Fondo *</label>
            <select
              value={formData.background_type}
              onChange={(e) => handleChange("background_type", e.target.value as "youtube" | "image")}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              required
            >
              <option value="image">Imagen</option>
              <option value="youtube">YouTube Video</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Seguridad profesional para tu hogar"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subtítulo</label>
          <Textarea
            value={formData.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Descripción breve del hero..."
            rows={2}
          />
        </div>

        {formData.background_type === "youtube" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube ID</label>
            <Input
              value={formData.youtube_id}
              onChange={(e) => handleChange("youtube_id", e.target.value)}
              placeholder="dQw4w9WgXcQ"
            />
          </div>
        )}

        {formData.background_type === "image" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Imagen</label>
              <Input
                value={formData.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Imagen Móvil</label>
              <Input
                value={formData.mobile_image_url}
                onChange={(e) => handleChange("mobile_image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* CTAs Section */}
        <div className="space-y-2 border p-4 rounded-md">
          <label className="text-sm font-medium">Botones de Acción (CTAs)</label>
          
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Texto"
            />
            <Input
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/contacto"
            />
            <Input
              value={ctaVariant}
              onChange={(e) => setCtaVariant(e.target.value)}
              placeholder="primary"
            />
          </div>
          
          <Button type="button" variant="outline" onClick={addCta} className="w-full">
            Agregar CTA
          </Button>

          {formData.ctas && formData.ctas.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.ctas.map((cta, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{cta.text} → {cta.href}</span>
                  <button
                    type="button"
                    onClick={() => removeCta(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div className="space-y-2 border p-4 rounded-md">
          <label className="text-sm font-medium">Badges</label>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Texto del badge"
            />
            <Input
              value={badgeIcon}
              onChange={(e) => setBadgeIcon(e.target.value)}
              placeholder="Icono (opcional)"
            />
          </div>
          
          <Button type="button" variant="outline" onClick={addBadge} className="w-full">
            Agregar Badge
          </Button>

          {formData.badges && formData.badges.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{badge.icon && `${badge.icon} `}{badge.text}</span>
                  <button
                    type="button"
                    onClick={() => removeBadge(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
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
            Hero activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("heroes")}
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
