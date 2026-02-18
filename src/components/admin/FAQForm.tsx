import { useState, useEffect } from 'react';
import type { Id } from '@convex/_generated/dataModel';

interface FAQ {
  _id: Id<'faqs'>;
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface FAQFormProps {
  faq: FAQ | null;
  onSubmit: (data: Partial<FAQ>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  categoryOptions: { value: string; label: string }[];
}

interface FormData {
  question: string;
  answer: string;
  category: string;
  order: number;
}

const initialFormData: FormData = {
  question: '',
  answer: '',
  category: 'general',
  order: 1,
};

export default function FAQForm({
  faq,
  onSubmit,
  onCancel,
  isSubmitting,
  categoryOptions,
}: FAQFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Initialize form with FAQ data if editing
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'general',
        order: faq.order || 1,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [faq]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.question.trim() ||
      !formData.answer.trim() ||
      !formData.category.trim()
    ) {
      alert(
        'Por favor completa todos los campos requeridos: Pregunta, Respuesta y Categoría'
      );
      return;
    }

    const data: Partial<FAQ> = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      category: formData.category,
      order: formData.order,
    };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {faq ? 'Editar FAQ' : 'Nueva FAQ'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Ej: ¿Qué es la certificación OS10?"
                required
              />
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                placeholder="Escribe la respuesta detallada..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.answer.length} caracteres
              </p>
            </div>

            {/* Category and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={1}
                  placeholder="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  El orden determina la posición en el listado
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Consejos para FAQs efectivas
                  </h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Usa preguntas que los clientes realmente hacen</li>
                    <li>• Respuestas claras y concisas (100-200 palabras)</li>
                    <li>• Agrupa por categoría para facilitar navegación</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
