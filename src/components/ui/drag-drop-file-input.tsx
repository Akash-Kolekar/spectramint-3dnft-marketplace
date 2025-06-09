import React, { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

type Props = {
  onFileChange: (file: File | null, base64: string | null) => void;
  imagePreview?: string | null;
  accept?: string;
  name?: string;
  error?: string | null;
};

const DragAndDropInputFilePreview = ({
  onFileChange,
  imagePreview,
  accept = "image/jpeg, image/png, image/jpg, image/webp",
  name = "file",
  error,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileType = file.type;
        if (accept.includes(fileType)) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              onFileChange(file, reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onFileChange, accept]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onFileChange(file, reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileChange]
  );

  const clearImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileChange(null, null);
    },
    [onFileChange]
  );

  return (
    <div className="space-y-2">
      <div
        className={`relative min-h-[120px] w-full cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all
          ${isDragging ? "border-primary bg-primary/10" : "hover:bg-muted/25"}
          ${error ? "border-destructive" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${name}`)?.click()}
      >
        <input
          id={`file-input-${name}`}
          type="file"
          accept={accept}
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto h-auto max-h-[200px] w-auto max-w-full rounded-md object-contain"
              />
              <button
                onClick={clearImage}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/80 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Click to replace or drop a new image
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full flex items-center justify-center aspect-square border border-dashed p-3 mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-center mb-1 text-sm text-muted-foreground">
              Drag &apos;n&apos; drop image here, or click to select image
            </p>
            <p className="text-xs text-center text-muted-foreground/70">
              Supports: JPG, PNG, JPEG, WEBP
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default DragAndDropInputFilePreview;
