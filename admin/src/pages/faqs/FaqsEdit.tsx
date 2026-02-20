/**
 * FAQs Edit Page
 * 
 * Form for editing an existing FAQ.
 */

import { useNavigation, useUpdate } from "@refinedev/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active?: boolean;
}

interface FaqsEditProps {
  id: string;
}

export function FaqsEdit({ id }: FaqsEditProps) {
  const { list } = useNavigation();
  const { mutate: update } = useUpdate();

  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "",
    order: 0,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    update({
      resource: "faqs",
      id: id,
      values: formData,
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        list("faqs");
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleChange = (field: keyof FAQFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar FAQ</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pregunta *</label>
          <Input
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder="¿Qué servicios de seguridad ofrecen?"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Respuesta *</label>
          <Textarea
            value={formData.answer}
            onChange={(e) => handleChange("answer", e.target.value)}
            placeholder="Respuesta a la pregunta frecuentes..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría *</label>
            <Input
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Seguridad"
              required
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
            FAQ activo
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => list("faqs")}
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
