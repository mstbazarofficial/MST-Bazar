// src/components/my-ui/single-image-uploader.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useDropzone } from "react-dropzone";

interface SingleImageUploaderProps {
  value?: string | null;
  onChange: (url: string, publicId: string) => void;
  uploadPreset: string;
  aspectRatio?: number;
  error?: string;
}

export function SingleImageUploader({
  value,
  onChange,
  aspectRatio,
  uploadPreset,
  error,
}: SingleImageUploaderProps) {
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef<CropperRef>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setCropperImage(reader.result as string);
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleCropComplete = async () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;

    setUploading(true);
    setProgress(0);
    setCropperImage(null); // Close cropper dialog immediately

    try {
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/jpeg", 0.9),
      );
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

      const result = await uploadToCloudinary(file, uploadPreset, setProgress);

      onChange(result.secure_url, result.public_id);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    onChange("", "");
  };

  return (
    <div className="w-full">
      {/* 1. Dropzone State (Visible when no value is set and not uploading) */}
      {!value && !uploading && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg h-62.5 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop image here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, or WebP (max 5MB)
          </p>
        </div>
      )}

      {/* 2. Cropper Dialog */}
      <Dialog
        open={!!cropperImage}
        onOpenChange={(open) => !open && setCropperImage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="h-75 md:h-96 w-full rounded-md overflow-hidden bg-black/5 border relative">
            {cropperImage && (
              <Cropper
                src={cropperImage}
                className="h-full w-full"
                stencilProps={aspectRatio ? { aspectRatio } : undefined}
                ref={cropperRef}
              />
            )}
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCropperImage(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCropComplete}>
              Confirm & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Uploading State */}
      {uploading && (
        <div className="h-62.5 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 bg-muted/20">
          <div className="flex items-center gap-2 font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Uploading... {progress}%
          </div>
          <div className="w-full max-w-50">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}

      {/* 4. Success / Value Preview State */}
      {value && !uploading && (
        <div className="group relative h-62.5 w-full overflow-hidden rounded-lg border bg-muted/20 transition-all">
          <Image
            fill
            src={value}
            alt="Uploaded preview"
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Floating Action Button */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="size-8 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
              title="Remove image"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-[0.8rem] font-medium text-destructive mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
