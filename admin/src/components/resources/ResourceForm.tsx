/**
 * ResourceForm - Generic form component for Refine
 * 
 * Creates forms for creating and editing resources.
 */

import { useForm, useNavigation } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Save, X } from "lucide-react";

// Field type definitions
export type FieldType = 
  | "text" 
  | "textarea" 
  | "number" 
  | "email" 
  | "password"
  | "checkbox" 
  | "switch"
  | "select"
  | "date";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // For select fields
  rows?: number; // For textarea
}

// Component props
interface ResourceFormProps {
  resource: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

type FormInputProps = {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
};

/**
 * Individual form input component
 */
function FormInput({ field, value, onChange, error }: FormInputProps) {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows || 4}
          className={error ? "border-red-500" : ""}
        />
      );
    
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
          {field.label && (
            <Label htmlFor={field.name} className="text-gray-600">
              {field.label}
            </Label>
          )}
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={field.name}
            checked={value || false}
            onCheckedChange={onChange}
          />
          {field.label && (
            <Label htmlFor={field.name} className="text-gray-600">
              {field.label}
            </Label>
          )}
        </div>
      );

    case "select":
      return (
        <select
          id={field.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Seleccionar...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "number":
      return (
        <Input
          id={field.name}
          type="number"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "email":
      return (
        <Input
          id={field.name}
          type="email"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "password":
      return (
        <Input
          id={field.name}
          type="password"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "date":
      return (
        <Input
          id={field.name}
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return (
        <Input
          id={field.name}
          type="text"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

/**
 * Generic ResourceForm component
 */
export function ResourceForm({
  resource,
  fields,
  initialValues,
  onSuccess,
}: ResourceFormProps) {
  const { list } = useNavigation();
  const { onFinish, formLoading } = useForm({
    resource,
    action: initialValues ? "edit" : "create",
    id: initialValues?._id,
  });

  const [formData, setFormData] = useState<Record<string, any>>(
    initialValues || {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onFinish(formData);
      onSuccess?.();
      list(resource);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields */}
      {fields.map((field) => {
        // Skip label for checkbox/switch as they're rendered inline
        const showLabel = field.type !== "checkbox" && field.type !== "switch";
        
        return (
          <div key={field.name} className="space-y-2">
            {showLabel && (
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <FormInput
              field={field}
              value={formData[field.name]}
              onChange={(value) => handleChange(field.name, value)}
            />
          </div>
        );
      })}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => list(resource)}
          disabled={formLoading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={formLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          {formLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
