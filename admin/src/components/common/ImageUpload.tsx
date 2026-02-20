/**
 * ImageUpload - Component for uploading images to Convex Storage
 * 
 * Handles image selection, preview, upload to Convex storage, and deletion.
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Upload, Loader2 } from "lucide-react";

const CONVEX_URL = 'https://guardman-100dd.oficina-desarrollo-33.convex.cloud';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string, storageId?: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  storageId?: string; // Optional storage ID for deletion
}

/**
 * Call a Convex mutation via REST API
 */
async function convexMutation(functionName: string, args: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Convex-Client": "convex-react-client-1.0.0",
    },
    body: JSON.stringify({
      function: functionName,
      args,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Convex mutation failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * ImageUpload component with Convex storage integration
 */
export function ImageUpload({
  value,
  onChange,
  label = "Imagen",
  accept = "image/*",
  maxSize = 5,
  storageId,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStorageId, setCurrentStorageId] = useState<string | undefined>(storageId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes externally
  useEffect(() => {
    if (value !== preview) {
      setPreview(value || null);
    }
  }, [value]);

  // Update storageId when prop changes
  useEffect(() => {
    if (storageId !== currentStorageId) {
      setCurrentStorageId(storageId);
    }
  }, [storageId]);

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`La imagen no puede superar los ${maxSize}MB`);
      return;
    }

    // Create preview immediately
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
      // Step 1: Get upload URL from Convex
      const uploadUrl = await convexMutation("storage:generateUploadUrl", {}) as string;
      
      // Step 2: Upload file to the URL
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      // Parse the storage ID from response - Convex returns it as a string
      const storageIdResult = await result.text();
      
      // Extract storage ID from the response (format: "Id<"_storage">xxx"")
      const storageIdMatch = storageIdResult.match(/Id<"_storage">([^"]+)"/);
      const storageIdValue = storageIdMatch ? storageIdMatch[1] : storageIdResult.replace(/"/g, "");
      
      // Step 3: Get the public URL for the uploaded file
      const fileUrl = await getFileUrl(storageIdValue);
      
      if (fileUrl) {
        setCurrentStorageId(storageIdValue);
        onChange?.(fileUrl, storageIdValue);
      } else {
        throw new Error("Failed to get file URL");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
      // Reset preview on error
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  // Get file URL helper
  const getFileUrl = async (storageId: string): Promise<string | null> => {
    try {
      // Call the Convex query to get URL
      const response = await fetch(
        `${CONVEX_URL}/api/query?function=storage%3AgetFileUrl&args=${encodeURIComponent(JSON.stringify({ storageId }))}`,
        {
          headers: {
            "Convex-Client": "convex-react-client-1.0.0",
          },
        }
      );
      if (response.ok) {
        const url = await response.json();
        return url;
      }
      return null;
    } catch {
      // Fallback: construct URL directly from storage ID
      return `${CONVEX_URL}/api/storage/${storageId}`;
    }
  };

  // Handle remove/delete
  const handleRemove = async () => {
    // If there's a storage ID, try to delete from Convex storage
    if (currentStorageId) {
      try {
        await convexMutation("storage:deleteFile", { storageId: currentStorageId });
      } catch (error) {
        console.warn("Could not delete from storage:", error);
      }
    }
    
    setPreview(null);
    setCurrentStorageId(undefined);
    onChange?.("", undefined);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate unique ID for the input
  const inputId = `image-upload-${label.replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;

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
              className="max-h-48 rounded-lg mx-auto object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              id={inputId}
              disabled={isUploading}
            />
            <label htmlFor={inputId}>
              <div className="flex flex-col items-center cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
                    <span className="mt-2 text-green-600">Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-green-600 hover:text-green-700">
                      Seleccionar imagen
                    </span>
                  </>
                )}
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF hasta {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
