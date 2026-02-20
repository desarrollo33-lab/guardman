/**
 * ImageUpload - Component for uploading images to Convex Storage
 * 
 * Handles image selection, preview, and upload to Convex storage.
 */

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
}

/**
 * ImageUpload component
 */
export function ImageUpload({
  value,
  onChange,
  label = "Imagen",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Convex
    await uploadImage(file);
  };

  // Upload image to Convex storage
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      // For now, we'll use a simple approach with URL.createObjectURL
      // In production, you would use Convex storage mutations
      // This is a placeholder that stores the file as a blob URL
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create object URL for preview (not for production)
      const objectUrl = URL.createObjectURL(file);
      onChange?.(objectUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setPreview(null);
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium block">
          {label}
        </label>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg mx-auto"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <span className="text-green-600 hover:text-green-700 cursor-pointer">
                  {isUploading ? "Subiendo..." : "Seleccionar imagen"}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
