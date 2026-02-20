/**
 * Content Blocks Edit Page
 * 
 * Form for editing an existing content block.
 */

import { useNavigation } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContentBlockType = 
  | "hero_ajax"
  | "hero_video"
  | "cta_dual"
  | "services_grid"
  | "services_grid_ajax"
  | "stats_row"
  | "stats_section"
  | "process_steps"
  | "testimonials_slider"
  | "partners_grid"
  | "values_section"
  | "industries_grid"
  | "faqs_accordion"
  | "location_map"
  | "contact_form"
  | "content_rich"
  | "image_gallery"
  | "video_section"
  | "guardpod_feature";

interface ContentBlockFormData {
  page_slug: string;
  type: ContentBlockType;
  order: number;
  title: string;
  subtitle: string;
  content: string;
  data: Record<string, unknown> | null;
  is_visible: boolean;
  is_active: boolean;
}

const CONTENT_BLOCK_TYPES: { value: ContentBlockType; label: string }[] = [
  { value: "hero_ajax", label: "Hero AJAX" },
  { value: "hero_video", label: "Hero Video" },
  { value: "cta_dual", label: "CTA Dual" },
  { value: "services_grid", label: "Services Grid" },
  { value: "services_grid_ajax", label: "Services Grid AJAX" },
  { value: "stats_row", label: "Stats Row" },
  { value: "stats_section", label: "Stats Section" },
  { value: "process_steps", label: "Process Steps" },
  { value: "testimonials_slider", label: "Testimonials Slider" },
  { value: "partners_grid", label: "Partners Grid" },
  { value: "values_section", label: "Values Section" },
  { value: "industries_grid", label: "Industries Grid" },
  { value: "faqs_accordion", label: "FAQs Accordion" },
  { value: "location_map", label: "Location Map" },
  { value: "contact_form", label: "Contact Form" },
  { value: "content_rich", label: "Rich Content" },
  { value: "image_gallery", label: "Image Gallery" },
  { value: "video_section", label: "Video Section" },
  { value: "guardpod_feature", label: "GuardPod Feature" },
];

interface ContentBlocksEditProps {
  id: string;
}

export function ContentBlocksEdit({ id }: ContentBlocksEditProps) {
  const { list } = useNavigation();
  
  const [formData, setFormData] = useState<ContentBlockFormData>({
    page_slug: "",
    type: "content_rich",
    order: 0,
    title: "",
    subtitle: "",
    content: "",
    data: null,
    is_visible: true,
    is_active: true,
  });

  const [dataJson, setDataJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse JSON data if provided
    let parsedData = formData.data;
    if (dataJson.trim()) {
      try {
        parsedData = JSON.parse(dataJson);
        setJsonError(null);
      } catch {
        setJsonError("Invalid JSON format");
        return;
      }
    }

    const values = {
      page_slug: formData.page_slug,
      type: formData.type,
      order: formData.order,
      title: formData.title || undefined,
      subtitle: formData.subtitle || undefined,
      content: formData.content || undefined,
      data: parsedData,
      is_visible: formData.is_visible,
      is_active: formData.is_active,
    };
    
    console.log("Updating content block:", { id, values });
    
    // Note: For a full implementation, you would use useUpdate to save changes
    // For now, this follows the pattern from other edit pages
    setTimeout(() => {
      list("content_blocks");
    }, 500);
  };

  const handleChange = (field: keyof ContentBlockFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Editar Bloque de Contenido</h1>
      
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
            <label className="text-sm font-medium">Tipo de Bloque *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value as ContentBlockType)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              required
            >
              {CONTENT_BLOCK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Título del bloque"
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
          <label className="text-sm font-medium">Subtítulo</label>
          <Input
            value={formData.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Subtítulo o descripción breve"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contenido</label>
          <Textarea
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Contenido del bloque (Markdown o HTML)..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data (JSON)</label>
          <Textarea
            value={dataJson}
            onChange={(e) => {
              setDataJson(e.target.value);
              setJsonError(null);
            }}
            placeholder='{"key": "value"}'
            rows={4}
            className={`font-mono text-sm ${jsonError ? "border-red-500" : ""}`}
          />
          {jsonError && (
            <p className="text-sm text-red-500">{jsonError}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => handleChange("is_visible", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_visible" className="text-sm font-medium">
              Visible
            </label>
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
              Activo
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("content_blocks")}
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
