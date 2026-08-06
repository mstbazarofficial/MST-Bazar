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
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useDropzone } from "react-dropzone";

export type UploadedImage = { url: string; publicId: string };

interface MultipleImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  featuredIndex: number;
  onFeaturedChange: (index: number) => void;
  uploadPreset: string;
  aspectRatio?: number;
  error?: string;
}

type UploadingFile = { id: string; preview: string; progress: number };

export function MultipleImageUploader({
  value = [],
  onChange,
  featuredIndex,
  onFeaturedChange,
  uploadPreset,
  aspectRatio,
  error,
}: MultipleImageUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  // Crop Queue States
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const cropperRef = useRef<CropperRef>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setCropQueue((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  // Process the queue: set the first item as the active image to crop
  useEffect(() => {
    if (cropQueue.length > 0 && !currentImageSrc) {
      const file = cropQueue[0];
      const reader = new FileReader();
      reader.onload = () => setCurrentImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [cropQueue, currentImageSrc]);

  const handleConfirmCrop = async () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas || cropQueue.length === 0 || !currentImageSrc) return;

    try {
      // 1. Get blob exactly as done in SingleImageUploader
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/jpeg", 0.9),
      );
      const croppedFile = new File([blob], "cropped.jpg", {
        type: "image/jpeg",
      });

      const id = Math.random().toString(36).substring(7);
      const preview = URL.createObjectURL(croppedFile);

      // 2. Add to uploading UI state (shows in the grid)
      setUploadingFiles((prev) => [...prev, { id, preview, progress: 0 }]);

      // 3. Move queue forward (triggers next image if any)
      setCurrentImageSrc(null);
      setCropQueue((prev) => prev.slice(1));

      // 4. Start Cloudinary Upload in background
      uploadToCloudinary(croppedFile, uploadPreset, (prog) => {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: prog } : f)),
        );
      })
        .then((result) => {
          onChange([
            ...value,
            { url: result.secure_url, publicId: result.public_id },
          ]);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
          URL.revokeObjectURL(preview); // Clean up memory
        })
        .catch((err) => {
          console.error("Upload failed", err);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
        });
    } catch (err) {
      console.error("Cropping failed", err);
    }
  };

  const handleSkipCrop = () => {
    setCurrentImageSrc(null);
    setCropQueue((prev) => prev.slice(1));
  };

  const handleRemove = (indexToRemove: number) => {
    const newValues = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newValues);
    // REMOVE the onFeaturedChange logic here!
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50"
        }`}
      >
        <input {...getInputProps()} />
        <ImagePlus className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">
          Drag & drop images, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Upload up to 10 images. You will be prompted to crop them.
        </p>
      </div>

      {error && (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      )}

      {/* Image Grid */}
      {(value.length > 0 || uploadingFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {/* Successfully Uploaded Images */}
          {value.map((img, idx) => {
            const isFeatured = idx === featuredIndex;
            return (
              <div
                key={img.publicId}
                className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${
                  isFeatured
                    ? "border-primary"
                    : "border-transparent bg-muted/20"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Overlay - Always visible on mobile, hover on desktop */}
                <div className="absolute inset-0 bg-black/20 md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2">
                  <div className="flex w-full justify-between items-start gap-2">
                    <Button
                      type="button"
                      variant={isFeatured ? "default" : "secondary"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => onFeaturedChange(idx)}
                    >
                      <Star
                        className={`h-3 w-3 mr-1 ${isFeatured ? "fill-current" : ""}`}
                      />
                      {isFeatured ? "Featured" : "Set"}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 shrink-0 shadow-md"
                      onClick={() => handleRemove(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] uppercase font-bold tracking-wider py-1 text-center md:group-hover:opacity-0 transition-opacity">
                    Featured
                  </div>
                )}
              </div>
            );
          })}
          {/* Uploading Files (Temporary UI) */}
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="relative aspect-square rounded-lg border border-dashed bg-muted/20 overflow-hidden"
            >
              <Image
                src={file.preview}
                alt="Uploading..."
                fill
                className="object-cover opacity-50 grayscale"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[1px] p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                <Progress
                  value={file.progress}
                  className="h-1.5 w-full bg-primary/20"
                />
                <span className="text-xs font-medium mt-2">
                  {file.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cropper Dialog for Queue */}
      <Dialog
        open={!!currentImageSrc}
        onOpenChange={(open) => !open && handleSkipCrop()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image ({cropQueue.length} remaining)</DialogTitle>
          </DialogHeader>
          <div className="h-75 md:h-96 w-full rounded-md overflow-hidden bg-black/5 border relative">
            {currentImageSrc && (
              <Cropper
                src={currentImageSrc}
                className="h-full w-full"
                stencilProps={aspectRatio ? { aspectRatio } : undefined}
                ref={cropperRef}
              />
            )}
          </div>
          <DialogFooter className="gap-2!  mt-4">
            <Button variant="outline" onClick={handleSkipCrop}>
              Skip
            </Button>
            <Button onClick={handleConfirmCrop}>Confirm & Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
