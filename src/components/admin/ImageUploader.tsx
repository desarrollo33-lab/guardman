import { useState, useCallback, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  disabled?: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ImageUploader({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Imagen',
  disabled = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageId, setStorageId] = useState<Id<'_storage'> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveFileMetadata = useMutation(api.storage.saveFileMetadata);

  // Get the public URL for the uploaded file
  const fileUrl = useQuery(
    api.storage.getFileUrl,
    storageId ? { storageId } : 'skip'
  );

  // Update parent when URL becomes available
  const handledUrlRef = useRef<string | null>(null);
  if (fileUrl && fileUrl !== handledUrlRef.current && storageId) {
    handledUrlRef.current = fileUrl;
    onChange(fileUrl);
  }

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      if (
        !acceptedTypes.some((type) => file.type.match(type.replace('*', '.*')))
      ) {
        return `Tipo de archivo no permitido. Use: ${accept}`;
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setUploadStatus('uploading');
      setUploadProgress(0);

      try {
        // Step 1: Get upload URL
        setUploadProgress(10);
        const uploadUrl = await generateUploadUrl();

        // Step 2: Upload file to storage
        setUploadProgress(30);
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo');
        }

        setUploadProgress(70);
        const { storageId: newStorageId } = await response.json();

        // Step 3: Save metadata
        setUploadProgress(85);
        await saveFileMetadata({
          storageId: newStorageId as Id<'_storage'>,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });

        // Step 4: Set storage ID to trigger URL fetch
        setStorageId(newStorageId as Id<'_storage'>);
        setUploadProgress(100);
        setUploadStatus('success');

        // Reset status after a delay
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadProgress(0);
        }, 2000);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Error al subir la imagen'
        );
        setUploadProgress(0);
      }
    },
    [generateUploadUrl, saveFileMetadata]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        setUploadStatus('error');
        return;
      }
      uploadFile(file);
    },
    [validateFile, uploadFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
      // Reset input
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    setStorageId(null);
    onChange('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage(null);
    handledUrlRef.current = null;
  }, [onChange]);

  const isUploading = uploadStatus === 'uploading';
  const hasImage = value && !isUploading;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : hasImage
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 mb-3 relative">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${uploadProgress} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                {uploadProgress}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        )}

        {/* Image Preview */}
        {hasImage && (
          <div className="p-3">
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                  title="Reemplazar imagen"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                  title="Eliminar imagen"
                >
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drop Zone (when no image) */}
        {!hasImage && !isUploading && (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 mb-4 text-gray-400">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-blue-600 hover:text-blue-700">
                Haz clic para subir
              </span>{' '}
              o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">
              {(maxSize / (1024 * 1024)).toFixed(0)}MB máximo
            </p>
          </div>
        )}

        {/* Success State */}
        {uploadStatus === 'success' && !hasImage && (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 mb-2 text-green-500">
              <svg
                className="w-full h-full"
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
            </div>
            <p className="text-sm text-green-600 font-medium">
              Imagen subida correctamente
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Helper text */}
      {!errorMessage && !hasImage && (
        <p className="mt-2 text-xs text-gray-500">
          Formatos: JPEG, PNG, WebP, GIF
        </p>
      )}
    </div>
  );
}
